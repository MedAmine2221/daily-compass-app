import { auth, db } from "@/FirebaseConfig";
import { AI_API_KEY } from "@/keys";
import { GoogleGenAI } from "@google/genai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { Router } from "expo-router";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Linking } from 'react-native';
import { Text } from "react-native-paper";
import { STATIC_KNOWLEDGE } from "../constants";
import { PRIORITY, STATUS } from "../constants/enums";
import { DeleteItemOptions, getItemsOptions, Message } from "../constants/interfaces";
import { clearCalendar } from "../redux/calendar/calendarReducer";
import { clearChat, setChat } from "../redux/chat/chatReducer";
import { AppDispatch, store } from "../redux/store";
import { clearTask } from "../redux/task/taskReducer";
import { clearUser } from "../redux/user/userReducer";
export const saveToken = async (token: string) => {
  try {
    
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("userToken")
  } catch (error) {
    console.error('Error removing token:', error);
  }
};


export const uploadImageToCloudinary = async (localUri: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté");

    const data = new FormData();
    data.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
    
    // Ton preset name (attention à l'espace !)
    data.append('upload_preset', 'daily compass app');
    
    const res = await fetch('https://api.cloudinary.com/v1_1/dfukepvh3/image/upload', {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(`Upload failed: ${res.status}`);
    }

    const json = await res.json();
    return json.secure_url;
  } catch (error) {
    console.error("❌ Erreur upload image:", error);
    return null;
  }
};

export const pickImageFromGallery = async () => {
  // Request permissions if not already granted
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  let selectedImageUri;
  if (!result.canceled && result.assets && result.assets.length > 0) {
    selectedImageUri = result.assets[0].uri;
  }
  return selectedImageUri;
};

export const openLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log("Impossible d'ouvrir l'URL :", url);
  }
};
const ai = new GoogleGenAI({
  apiKey: AI_API_KEY,
  apiVersion: 'v1alpha'
});
export async function gemini(prompt: string) {
  let attempts = 0;
  const maxAttempts = 3;

  const fullPrompt = `
  ### CONTEXTE FIXE ###

  Application: ${JSON.stringify(STATIC_KNOWLEDGE.app)}
  Développeur: ${JSON.stringify(STATIC_KNOWLEDGE.developer)}

  ### QUESTION UTILISATEUR ###
  ${prompt}

  ### CONSIGNE ###
  Tu dois toujours utiliser les informations du CONTEXTE FIXE pour répondre si l'utilisateur pose une question sur l'application ou le développeur, utiliser strictement ce qui est fourni ci-dessus.
  Si la question concerne le développeur, réponds avec les informations principales et indique que le CV est disponible pour téléchargement à : ${JSON.stringify(STATIC_KNOWLEDGE.developer.cv_file)}.
  si non vous pouvez utiliser vos propre connaissance
  `;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      const text = response.text;
      try {
        return JSON.parse(text as string);
      } catch {
        return text;
      }
    } catch (error: any) {
      attempts++;
      if (error.message?.includes("503") && attempts < maxAttempts) {
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }
      return null;
    }
  }
}
export default async function createMessage(data: Message){
  const user = auth.currentUser;

  const chatDocRef = collection(db, "chat");
  await addDoc(chatDocRef, {
    sender: data.sender,
    text: data.text,
    time: data.time,
    userId: user?.uid,
    createdAt: new Date().toISOString(),
  });
  store.dispatch(setChat(
    {
      sender: data.sender,
      text: data.text,
      time: data.time,
      userId: user?.uid,
      createdAt: new Date().toISOString(),
    }
  ));

}
export function logout(router: Router, dispatch: AppDispatch) {
  router.navigate("/auth");
  removeToken();
  dispatch(clearUser())
  dispatch(clearChat())
  dispatch(clearTask())
  dispatch(clearCalendar())
}
export const transformTasksForCalendar = (tasksFromFirestore: any[]) => {
  const calendarData: Record<
    string,
    { name: string; dateDebut: string; dateFin: string; priority: string, goalName: string }[]
  > = {};

  const getDatesBetween = (start: string, end: string) => {
    const dates: string[] = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      const dateKey = current.toISOString().split("T")[0]; // YYYY-MM-DD
      dates.push(dateKey);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  tasksFromFirestore.forEach(task => {
    // Use only the date part, ignore time
    const startDate = task.startDate.split(" ")[0];
    const endDate = task.endDate.split(" ")[0];
    const allDates = getDatesBetween(startDate, endDate);

    allDates.forEach(date => {
      if (!calendarData[date]) calendarData[date] = [];
      calendarData[date].push({
        name: task.title || task.name,
        dateDebut: task.startDate,
        dateFin: task.endDate,
        priority: task.priority,
        goalName: task.goalName,
      });
    });
  });

  return calendarData;
};
export const normalize = (str: string) => str?.normalize("NFC").replace(/’/g, "'").trim();
export const renderMessageText = (text: string, item: any) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Text
          key={index}
          style={{ color: 'blue', textDecorationLine: 'underline' }}
          onPress={() => Linking.openURL(part)}
        >
          {part}
        </Text>
      );
    } else {
      return <Text 
                style={{ color: item?.sender === "user" ? "white" : "black" }}
                className="text-base"
                key={index}
              >
                {part}
              </Text>;
    }
  });
};
export const saveItem = async ({ key, value }: { key: string, value: object | string | null}) => {
  try {
    // Convert non-string values (like objects or arrays) to a JSON string
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
export const getData = async ({key}:{key:string}) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);    
    // If the data was stored as a JSON string, parse it back to an object/array
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.error("Error retrieving data:", e);
  }
};
export const getStatusColorClass = (status: string) => {  
  switch (status) {
    case PRIORITY.MEDIUM:
      return "bg-orange-500";
    case PRIORITY.HIGH:
      return "bg-red-500";
    case PRIORITY.LOW:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const getActionColor = (action: string) => {
    switch (action) {
    case "add":
      return "#86efac";
    case "update":
      return "#fdba74";
    case "delete":
      return "#fee2e2";
    default:
      return "#fee2e2";
  }
}

export const getIconColor = (action: string) => {
  switch (action) {
    case "add":
      return "#0f5f27";
    case "update":
      return "#9a3c02";
    case "delete":
      return "#b81e1e";
    default:
      return "#b81e1e";
  }
};

export const getStatusIcons = (status: string) => {
  switch (status) {
    case STATUS.InProgress:
      return "progress-clock";
    case STATUS.TODO:
      return "clipboard-text-outline";
    case STATUS.DONE:
      return "check-circle-outline";
    default:
      return "clipboard-text-outline";
  }
};
export const getCurrentTask = (data: any) => {

  const now = new Date();
  now.setHours(now.getHours() + 1);
  const today = now.toISOString().split("T")[0];
  const todayTasks = data?.[today] || [];

  const currentTask = todayTasks.find((task: { dateFin: string, dateDebut: string }) => {
    const start = new Date(task.dateDebut.replace(" ", "T"));
    start.setHours(start.getHours()+1);
    const end = new Date(task.dateFin.replace(" ", "T"));
    end.setHours(end.getHours()+1);
    return now >= start && now <= end;
  });
  return currentTask;
};

export const formatDate = (dateString: string, lang?:string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(lang ? lang : "fr-FR", options);
};

export const getDatesBetween = (start: string, end: string) => {
  const dates: string[] = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const getUsers = async ({
  id
}: {
  id: string
}) => {
  const userDocRef = doc(db, "users", id);
  const userSnap = await getDoc(userDocRef);
  return userSnap;
}

export const getItems = async (options: getItemsOptions) => {
  let snapshot;
  if (options.collectionName && options.filters && options.filters.length > 0) { 
    const q = query(
      collection(db, options.collectionName),
      ...options.filters.map(f => where(f.field, f.operator, f.value))
    );
    snapshot = await getDocs(q);
  }
  return snapshot;
}
export const deleteItem = async (options: DeleteItemOptions, dispatch?: any, closeModal?: () => void) => {
  try {
    if (dispatch) dispatch({ type: "loading/setLoadingTrue" });

    if (options.collectionName && options.filters && options.filters.length > 0) {
      const snapshot = await getItems({
        collectionName: options.collectionName,
        filters: options.filters
      })
      if(snapshot) {
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, options.collectionName, d.id)));
        await Promise.all(deletePromises);
      }
    }

    if (options.updateStates && options.updateStates.length > 0) {
      options.updateStates.forEach(action => dispatch(action));
    }
  } catch (error) {
    console.error("Delete error:", error);
  } finally {
    if (dispatch) dispatch({ type: "loading/setLoadingFalse" });
    if (closeModal) closeModal();
  }
};

export const updateItems = async ({collectionName, userId, dataToUpdated}:any, dispatch?: any, updateStates?: any) => {
  await updateDoc(doc(db, collectionName, userId), dataToUpdated);
  if(dispatch && updateStates){
    dispatch(updateStates)
  }
}

export const getPrompt = (goal: any) => {
  return `
    Create a detailed breakdown of tasks to achieve the following goal:
    * Goal Name: ${goal.name}
    * Description: ${goal.description}
    * Priority: ${goal.priority}
    * Start Date: ${new Date().toISOString().split("T")[0]}
    * Deadline: ${goal.deadline}
    Rules:
    1. If the goal priority is **CRITICAL** or **HIGH**
       * Each day must have **3 tasks**.
       * Each task should be **no longer than 2 hours**.
    2. **If the goal priority is ****MEDIUM**
       * Each day should have **2 tasks**.
       * Each task should be **no longer than 2 hours**.
    3. **If the goal priority is LOW**
       * Each day should have **1 task** **no longer than 2 hours**.
    4. Divide the goal into the **maximum number of achievable tasks**, considering that the person has **very low capacity**
    Return **only a valid JSON array** in the following format
    [
      {
        "title": "Task title",
        "description": "Short description",
        "priority": "${goal.priority}",
        "startDate": "YYYY-MM-DD hh:mm",
        "endDate": "YYYY-MM-DD hh:mm",
        "status": "todo",
        "goalName": "${goal.name}"
        "emailNotification": ${false}
      }
    ]
    Replace "priority", "goalName", "emailNotification" and "status" with the actual values based on the goal details above.
  `
}


export const getTabColor = (tabKey: string) => {
  switch (tabKey) {
    case 'first':
      return '#EF4444'; 
    case 'second':
      return '#F59E0B';
    case 'third':
      return '#10B981';
    default:
      return '#6B7280';
  }
};