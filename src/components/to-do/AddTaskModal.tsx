import { auth, db } from "@/FirebaseConfig";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { PRIORITY } from "@/src/constants/enums";
import { AddTaskModalInterface } from "@/src/constants/interfaces";
import { setCalendar } from "@/src/redux/calendar/calendarReducer";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { setTask } from "@/src/redux/task/taskReducer";
import taskSchema from "@/src/schema/tasksSchema";
import { getUsers, transformTasksForCalendar } from "@/src/utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AlertVerification from "../AlertVerification";
import AppDatePicker from "../AppDatePicker";
import AppDropdown from "../AppDropdown";
import AppInput from "../AppInput";

export const AddTaskModal = ({ visible, hideModal }: AddTaskModalInterface)=>{  
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState)=> state.loading.loading)
  const goals = useSelector((state: RootState) => state.user.items)?.goals?.map((goal: any) => {
    return { label: goal.name, value: goal.name };
  });
  const tasks = useSelector((state: RootState)=> state.tasks.tasks);  
  const calendar = useSelector((state: RootState)=> state.calendar.calendar);  

  const [selectedGoal, setSelectedGoal] = useState(goals && goals.length > 0 ? goals[0].value : "");  
  const [openModal, setOpenModal] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(taskSchema)
  });
  const userId = auth.currentUser?.uid 
  const onSubmit = async (data: any) => {
    dispatch(setLoadingTrue());
    if(userId){
      const tasksRef = collection(db, "tasks");
      const snap = await getUsers({id: userId})
      if (snap.exists()){
        const userData = snap.data();
        const goals = userData.goals || [];
        const goal = goals.find((g: any) => g.name === selectedGoal);        
        const dataAdded = {
          title: data.title,
          description: data.description,
          priority: goal === undefined ? PRIORITY.CRITICAL : goal.priority,
          startDate: data.startDate,
          endDate: data.endDate,
          status: "todo",
          emailNotification: false,
          goalName: goal === undefined ? t("todo.taskCritical") : goal.name,
          userId: userId,
          createdAt: new Date().toISOString(),
        }
        await addDoc(tasksRef, dataAdded);
        dispatch(setTask({...tasks, ...dataAdded}))
        const calendarReadyData = transformTasksForCalendar([dataAdded]);

        const mergedCalendar = { ...calendar };
        Object.entries(calendarReadyData).forEach(([date, tasks]) => {
          if (!mergedCalendar[date]) {
            mergedCalendar[date] = tasks;
          } else {
            mergedCalendar[date] = [...mergedCalendar[date], ...tasks];
          }
        });

        dispatch(setCalendar(mergedCalendar));
        alert(t("todo.addModal.verificationModal.alertMsg"))
      }
      closeModal()
    }

  };
  const closeModal = () =>{
    setOpenModal(false);
    reset();
    dispatch(setLoadingFalse());
    hideModal();
  }
  const onCancel = useCallback(()=>{setOpenModal(false)}, []);
  
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={()=>closeModal()}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 40,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-end">
            <IconButton icon="close" iconColor="black" size={30} onPress={() => closeModal()} />
          </View>
          <Text className="text-3xl m-5" style={{color:PRIMARY_COLOR, fontWeight: "bold"}}>
            {t("todo.addModal.title")}
          </Text>
          <AppDropdown                 
            label={t("todo.addModal.goalName")}
            data={goals}
            icon = "target"
            onChange={
              setSelectedGoal
            }
            valeur={selectedGoal}
          />
          <View className="my-2"/>
          <AppInput
            control={control}
            errors={errors}
            name="title"
            label={t("todo.addModal.TaskTitle")}
            icon="format-title"
          />
          <View className="my-2"/>
          <AppInput
            control={control}
            errors={errors}
            name="description"
            label={t("todo.addModal.taskDesc")}
            multiline
            icon="subtitles"
          />
          <View className="my-2"/>
          <AppDatePicker
            control={control}
            errors={errors} 
            name={"startDate"} 
            label={t("todo.addModal.taskStartDate")}
            icon="clock-time-five-outline"
          />
          <View className="my-2"/>
          <AppDatePicker
            control={control} 
            errors={errors} 
            name={"endDate"} 
            label={t("todo.addModal.taskEndDate")}
            icon="timer-off"
          />                   
          <View className="items-center">
            <Button
              mode="contained"
              onPress={handleSubmit(()=>setOpenModal(true))}
              style={{
                backgroundColor: !loading ? PRIMARY_COLOR : PRIMARY_COLOR+"50",
                marginTop: 10,
                width: "50%",
              }}
              disabled={loading}
              labelStyle={{ color: "white" }}
            >
              {loading ? 
                <ActivityIndicator color={"white"} size={25}/>
                :
                <Text style={{color: "white"}}>
                  {t("todo.addModal.submit")}
                </Text>
              }
            </Button>
          </View>
        </ScrollView>
        {
          openModal &&
            <AlertVerification
              title={t("todo.addModal.verificationModal.title")}
              body={t("todo.addModal.verificationModal.body")}
              icon={'plus'}
              visible={openModal} 
              onConfirm={handleSubmit(onSubmit)}
              onCancel={onCancel}
              cancel
              action= "add"
            />
        } 
      </Modal>

    </Portal>
  );
}
