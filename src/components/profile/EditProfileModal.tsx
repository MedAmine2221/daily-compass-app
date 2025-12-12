import { auth, db } from "@/FirebaseConfig";
import { priorities } from "@/src/constants";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { EditProfileModalInterface } from "@/src/constants/interfaces";
import { setCalendar } from "@/src/redux/calendar/calendarReducer";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { removeTaskWithGoalName, setTask } from "@/src/redux/task/taskReducer";
import { setUser } from "@/src/redux/user/userReducer";
import editProfileSchema from "@/src/schema/editProfileSchema";
import editProfileWithGoalsSchema from "@/src/schema/editProfileWithGoalsSchema";
import { gemini, getPrompt, transformTasksForCalendar, updateItems } from "@/src/utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AlertVerification from "../AlertVerification";
import AppDatePicker from "../AppDatePicker";
import AppDropdown from "../AppDropdown";
import AppInput from "../AppInput";

export default function EditProfileModal({ userInfo, visible, hideModal }: EditProfileModalInterface) {
  const calendar = useSelector((state: RootState) => state.calendar.calendar);
  const loading = useSelector((state: RootState)=>state.loading.loading);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tasks = useSelector((state: RootState)=> state.tasks.tasks);
  const initGoalsListLength = userInfo?.goals?.length || 0;
  const [addGoals, setAddGoals] = useState(false);
  const [removeGoals, setRemoveGoals] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalHandlers, setModalHandlers] = useState({
    onConfirm: () => {},
    onCancel: () => {}
  });

  const askUserConfirmation = () => {
    return new Promise<boolean>((resolve) => {
      setOpenModal(true);

      setModalHandlers({
        onConfirm: () => {
          resolve(true);
          setOpenModal(false);
          dispatch(setLoadingTrue());
        },
        onCancel: () => {
          resolve(false);
          setOpenModal(false);
          dispatch(setLoadingTrue());
        }
      });
    });
  };

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      username: userInfo?.username,
      phoneNumber: userInfo?.phoneNumber,
      address: userInfo?.address,
    },
  });
  const { control: control2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm({
    resolver: yupResolver(editProfileWithGoalsSchema),
    defaultValues: {
      username: userInfo?.username,
      phoneNumber: userInfo?.phoneNumber,
      address: userInfo?.address,
      goals: userInfo?.goals,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control2,
    name: "goals",
  });

  const addGoal = () => {    
    setAddGoals(true);
    append({
      name: "",
      description: "",
      priority: "MEDIUM",
      deadline: "",
    });
  };

  const updateUser = async (data: any) => {    
    const firebaseUser = auth.currentUser;
    await updateItems({
      collectionName: "users", 
      userId: firebaseUser!.uid, 
      dataToUpdated: data
    }, dispatch, setUser({ ...(userInfo || {}), ...data })) 
    const updatedUser = { ...(userInfo || {}), ...data };
    reset(updatedUser);
    reset2({ ...updatedUser, goals: updatedUser.goals || [] });
  };

  /** GENERATE AI TASKS */
  const generateAiTasks = async (data: any) => {
    const firebaseUser = auth.currentUser;
    const newGoalsCount = data.goals.length - initGoalsListLength;
    const newGoals = data.goals.slice(-newGoalsCount);

    const tasksRef = collection(db, "tasks");

    for (const goal of newGoals) {
      const prompt = getPrompt(goal);
      let aiResponse = await gemini(prompt);
      const clean = aiResponse
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      let taskList = [];
      try {
        taskList = JSON.parse(clean);
      } catch {
        console.log("Invalid JSON:", clean);
        continue;
      }      
      for (const task of taskList) {
        const addedTask = {
          ...task,
          userId: firebaseUser!.uid,
          createdAt: new Date().toISOString(),
        }
        await addDoc(tasksRef, addedTask);
        dispatch(setTask({...tasks, ...addedTask}))
        const calendarReadyData = transformTasksForCalendar([addedTask]);
        const mergedCalendar = { ...calendar };
        Object.entries(calendarReadyData).forEach(([date, tasks]) => {
          if (!mergedCalendar[date]) {
            mergedCalendar[date] = tasks;
          } else {
            mergedCalendar[date] = [...mergedCalendar[date], ...tasks];
          }
        });

        dispatch(setCalendar(mergedCalendar));
      }
    }
    Alert.alert("Goals and related tasks have been processed!");
  };

  const onSubmit = async (data: any) => {
    try {
      const newGoalsCount = data.goals?.length - initGoalsListLength;
      if (addGoals || newGoalsCount <= 0) {        
        if (newGoalsCount > 0){
          const allow = await askUserConfirmation();
          if (allow) {
            await generateAiTasks(data);
          }
        } 
        await updateUser(data);
        dispatch(removeTaskWithGoalName({title: data?.name}))
        closeModal();
        return;
      }
      await updateUser(data);
      closeModal();

    } catch (e) {
      console.log("Error:", e);
      Alert.alert("An error occurred.");
    }finally{
      dispatch(setLoadingFalse());
    }
  };

  const closeModal = () => {
    reset();
    reset2();
    setAddGoals(false);
    hideModal();
  };
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 40,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl m-5" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
              {t("editProfileModal.title")}
            </Text>
            <IconButton icon="close" iconColor="black" size={30} onPress={closeModal} />
          </View>

          <AppInput control={addGoals ? control2 : control} errors={addGoals ? errors2 : errors} name="username" label={t("editProfileModal.userName")} icon="account" />
          <AppInput control={addGoals ? control2 : control} errors={addGoals ? errors2 : errors} name="phoneNumber" label={t("editProfileModal.phoneNbr")} icon="phone" keyboardType="phone-pad" />
          <AppInput control={addGoals ? control2 : control} errors={addGoals ? errors2 : errors} name="address" label={t("editProfileModal.address")} icon="map-marker" />

          {fields.map((field, index) => (
            <View key={field.id}>
              <View className="flex-row items-center justify-between">
                <AppInput control={control2} errors={errors2} name={`goals.${index}.name`} label={t("editProfileModal.goalName")} icon="target" />
                <IconButton 
                  icon="trash-can-outline" 
                  size={30} 
                  iconColor="red" 
                  onPress={() => {
                    remove(index); 
                    setRemoveGoals(true);
                  }} 
                />
              </View>

              <AppInput control={control2} errors={errors2} name={`goals.${index}.description`} label={t("editProfileModal.goalDesc")} icon="text" multiline />
              <AppDropdown 
                control={control2}
                errors={errors2}
                name={`goals.${index}.priority`}
                label="Priority"
                data={priorities}
                icon = "alert-circle-outline"
              />
              <View className="my-3" />
              <AppDatePicker
                control={control2} 
                errors={errors2} 
                name={`goals.${index}.deadline`} 
                label="Deadline"
              />
            </View>
          ))}

          <View className="items-center">
            <Button
              mode="contained-tonal"
              onPress={()=>addGoal()}
              style={{ marginTop: 15, width: "50%", backgroundColor: !loading ? "black" : "#aaa" }}
              disabled={loading}
            >
              <Text style={{ color: !loading ? "white" : "#ddd" }}>{t("editProfileModal.addGoal")}</Text>
            </Button>

            <Button
              mode="contained"
              onPress={(addGoals || removeGoals) ? handleSubmit2(onSubmit) : handleSubmit(onSubmit)}
              style={{
                backgroundColor: !loading ? PRIMARY_COLOR : PRIMARY_COLOR + "50",
                marginTop: 10,
                width: "50%",
              }}
              disabled={loading}
              labelStyle={{ color: "white" }}
            >
              {loading ? <ActivityIndicator color="white" size={25} /> : <Text style={{ color: "white" }}>{t("editProfileModal.submit")}</Text>}
            </Button>
          </View>
        </ScrollView>
      </Modal>
      {openModal && <AlertVerification
        visible={openModal}
        title="Are you sure you want to allow AI task creation?"
        body="This action cannot be undone."
        icon="information-variant-circle-outline"
        onConfirm={modalHandlers.onConfirm}
        onCancel={modalHandlers.onCancel}
        action= "add"
      />}
    </Portal>
  );
}