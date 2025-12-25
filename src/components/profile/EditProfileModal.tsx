import { priorities } from "@/src/constants";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { EditProfileModalInterface, GoalsInterface } from "@/src/constants/interfaces";
import { setCalendar } from "@/src/redux/calendar/calendarReducer";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { removeTaskWithGoalName, setTask } from "@/src/redux/task/taskReducer";
import { setUser } from "@/src/redux/user/userReducer";
import { editProfileWithGoalsSchema } from "@/src/schema/editProfileWithGoalsSchema";
import { gemini, getPrompt, transformTasksForCalendar, updateItems } from "@/src/utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../FirebaseConfig";
import AlertVerification from "../AlertVerification";
import AppDatePicker from "../AppDatePicker";
import AppDropdown from "../AppDropdown";
import AppInput from "../AppInput";

export default function EditProfileModal({ userInfo, visible, hideModal, deleteGoal }: EditProfileModalInterface) {
  const calendar = useSelector((state: RootState) => state.calendar.calendar);
  const loading = useSelector((state: RootState)=>state.loading.loading);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const initGoalsListLength = userInfo?.goals?.length || 0;
  const [addGoals, setAddGoals] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<{
    index: number;
    goals: GoalsInterface[];
  } | null>(null);
  const confirmDeleteGoal = (index: number) => {
    if (!userInfo?.goals) return;
    setGoalToDelete({ index, goals: userInfo.goals });
  };

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
    resolver: yupResolver(editProfileWithGoalsSchema(t)),
    defaultValues: {
      username: userInfo?.username,
      phoneNumber: userInfo?.phoneNumber,
      address: userInfo?.address,
      goals: userInfo?.goals,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
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
    reset({ ...updatedUser, goals: updatedUser.goals || [] });
  };

  /** GENERATE AI TASKS */
  const generateAiTasks = async (data: any) => {
    const firebaseUser = auth.currentUser;
    const newGoalsCount = data.goals.length - initGoalsListLength;
    const newGoals = data.goals.slice(-newGoalsCount);

    const tasksRef = collection(db, "tasks");

    let allNewTasks: any[] = [];

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
        };

        await addDoc(tasksRef, addedTask);
        allNewTasks.push(addedTask);
      }
    }
    const calendarReadyData = transformTasksForCalendar(allNewTasks);

    const mergedCalendar = { ...(calendar || {}) };

    Object.entries(calendarReadyData).forEach(([date, tasks]) => {
      if (!mergedCalendar[date]) {
        mergedCalendar[date] = tasks;
      } else {
        mergedCalendar[date] = [...mergedCalendar[date], ...tasks];
      }
    });

    dispatch(setCalendar(mergedCalendar));

    allNewTasks.forEach(task => {
      dispatch(setTask(task));
    });

    Alert.alert(t("aiTasks.success"));
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
      Alert.alert(t("onSubmitEditProfileAlert"));
    }finally{
      dispatch(setLoadingFalse());
    }
  };

  const closeModal = () => {
    reset();
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

          <AppInput control={ control } errors={ errors } name="username" label={t("editProfileModal.userName")} icon="account" />
          <View className="my-2" />
          <AppInput control={
            control
            } errors={
              errors
              } name="phoneNumber" label={t("editProfileModal.phoneNbr")} icon="phone" keyboardType="phone-pad" />
          <View className="my-2" />
          <AppInput control={
            control
            } errors={
              errors
              } name="address" label={t("editProfileModal.address")} icon="map-marker" />
          <View className="my-2" />
          {fields.map((field, index) => (
            <View
              key={field.id}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                padding: 10,
                marginBottom: 15,
                backgroundColor: "#f9f9f9",
              }}
            >
              {/* Ligne header avec icône trash sur toute la largeur */}
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <IconButton
                  icon="trash-can-outline"
                  size={25}
                  iconColor="red"
                  onPress={() => {
                    confirmDeleteGoal(index)
                    remove(index)
                  }}
                  style={{ margin: 0 }}
                />
              </View>

              <AppInput
                control={control}
                errors={errors}
                name={`goals.${index}.name`}
                label={t("editProfileModal.goalName")}
                icon="target"
              />
              <View style={{ marginVertical: 5 }} />
              <AppInput
                control={control}
                errors={errors}
                name={`goals.${index}.description`}
                label={t("editProfileModal.goalDesc")}
                icon="text"
              />
              <View style={{ marginVertical: 5 }} />
              <AppDropdown
                control={control}
                errors={errors}
                name={`goals.${index}.priority`}
                label={t("editProfileModal.priority")}
                data={priorities}
                icon="alert-circle-outline"
              />
              <View style={{ marginVertical: 5 }} />
              <AppDatePicker
                control={control}
                errors={errors}
                name={`goals.${index}.deadline`}
                label={t("editProfileModal.deadline")}
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
              onPress={
                handleSubmit(onSubmit) 
              }
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
      {goalToDelete && (
        <AlertVerification
          visible
          title={t("deleteGoal.title")}
          body={t("deleteGoal.body")}
          icon="trash-can-outline"
          onConfirm={() => {
            deleteGoal(goalToDelete.index, goalToDelete.goals);
            setGoalToDelete(null);
          }}
          onCancel={() => setGoalToDelete(null)}
          cancel
          action="delete"
        />
      )}
      {openModal && <AlertVerification
        visible={openModal}
        title={t("verifyEditProfil.title")}
        body={t("verifyEditProfil.body")}
        icon="information-variant-circle-outline"
        onConfirm={modalHandlers.onConfirm}
        onCancel={modalHandlers.onCancel}
        action= "add"
      />}
    </Portal>
  );
}