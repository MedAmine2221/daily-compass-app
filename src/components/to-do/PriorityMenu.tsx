import { auth } from '@/src/FirebaseConfig';
import { TaskInterface } from '@/src/constants/interfaces';
import { updateTask, updateTaskDone, updateTaskInProgress } from '@/src/redux/task/taskReducer';
import { getItems, updateItems } from '@/src/utils/functions';
import { useTranslation } from 'react-i18next';
import { View } from "react-native";
import { Icon, Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';

export default function PriorityMenu({from, item}:{from: string; item: TaskInterface}) {
    const dispatch = useDispatch();
    const user = auth.currentUser;
    const { t } = useTranslation();
    const updatePriority = async (priority: string) => {
        const snapshot = await getItems({
          collectionName: "tasks",
          filters: [
            {
              field: "userId",
              operator: '==',
              value: user?.uid,
            },
            {
              field: "goalName",
              operator: '==',
              value: item?.goalName,
            },
            {
              field: "title",
              operator: '==',
              value: item?.title,
            },
            {
              field: "endDate",
              operator: '==',
              value: item?.endDate,
            },
            {
              field: "startDate",
              operator: '==',
              value: item?.startDate,
            },
          ]
        })
        if (snapshot && !snapshot.empty) {
          await Promise.all(snapshot.docs.map((d) =>
              updateItems({
                collectionName: "tasks", 
                userId: d.id, 
                dataToUpdated: { priority }
              })
          ));
          if(from === "todo"){
            dispatch(updateTask({ title: item.title, updatedData: { priority } }));
          }else if(from === "inProgress"){
            dispatch(updateTaskDone({ title: item.title, updatedData: { priority } }));
          }else{
            dispatch(updateTaskInProgress({ title: item.title, updatedData: { priority } }));
          }
        }
    }
  return (
    <View className='bg-white rounded-lg shadow-lg w-[50%]'>
        <Menu.Item 
            leadingIcon={() => <Icon source="priority-low" size={24} color="white" />}
            onPress={() => updatePriority("LOW")}
            title={t("todo.priority.low")}
            titleStyle={{ color: "white" }}
            style={{
                marginTop: 2,
                backgroundColor: "#22c55e",
                borderColor: "#16a34a",
                borderWidth: 2,
            }}
        />
        <Menu.Item 
            leadingIcon={() => <Icon source="speedometer-medium" size={24} color="white" />}
            onPress={() => updatePriority("MEDIUM")}
            title={t("todo.priority.medium")}
            titleStyle={{ color: "white" }}
            style={{
                marginTop: 2,
                backgroundColor: "#facc15",
                borderColor: "#eab308",
                borderWidth: 2,
            }}
        />
        <Menu.Item 
            leadingIcon={() => <Icon source="priority-high" size={24} color="white" />}
            onPress={() => updatePriority("HIGH")}
            title={t("todo.priority.high")}
            titleStyle={{ color: "white" }}
            style={{
                marginTop: 2,
                backgroundColor: "#f97316",
                borderColor: "#ea580c",
                borderWidth: 2,
            }}
        />
        <Menu.Item 
            leadingIcon={() => <Icon source="exclamation" size={24} color="white" />}
            onPress={() => updatePriority("CRITICAL")}
            title={t("todo.priority.critical")}
            titleStyle={{ color: "white" }}
            style={{
                marginTop: 2,
                backgroundColor: "#ef4444",
                borderColor: "#dc2626",
                borderWidth: 2,
            }}
        />
    </View>
  );
}
