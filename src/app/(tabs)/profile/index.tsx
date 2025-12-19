import { auth, db } from "../../../FirebaseConfig";
import AlertVerification from "@/src/components/AlertVerification";
import AppHeader from "@/src/components/AppHeader";
import ChangePassword from "@/src/components/profile/ChangePasswordModal";
import EditProfileModal from "@/src/components/profile/EditProfileModal";
import GoalHistoryModal from "@/src/components/profile/GoalHistory";
import { PRIMARY_COLOR, RED } from "@/src/constants/colors";
import { GoalsInterface } from "@/src/constants/interfaces";
import { removeCalendarTasksByGoalName } from "@/src/redux/calendar/calendarReducer";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { AppDispatch, RootState } from "@/src/redux/store";
import { removeTaskWithGoalName } from "@/src/redux/task/taskReducer";
import { setUser } from "@/src/redux/user/userReducer";
import { deleteItem, logout, updateItems } from "@/src/utils/functions";
import { FlashList } from "@shopify/flash-list";
import { Router, useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, FAB, IconButton, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const login = auth.currentUser
  const user = useSelector((state: RootState) => state.user.items);
  const loading = useSelector((state: RootState) => state.loading.loading);  
  const [visible, setVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [visibleChangePass, setVisibleChangePass] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteGoalOpenModal, setDeleteGoalOpenModal] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const hideGoalHistoryModal = () => setHistoryVisible(false);
  const showChangePassModal = () => setVisibleChangePass(true);
  const hideChangePassModal = () => setVisibleChangePass(false);

  const { t } = useTranslation();
  const data=[
    { 
      title: t("profile.email"),
      subtitle: login?.email,
      icon: "gmail",
    },
    { 
      title: t("profile.phoneNbr"),
      subtitle: user?.phoneNumber ? user?.phoneNumber : t("profile.userPhone"),
      icon: "phone",
    },
    { 
      title: t("profile.goals"),
      subtitle: user?.goals?.length === 0 ? t("profile.goalsNull") : user?.goals,
      icon: "target",
    },
  ]
  const deleteGoal = async (goalIndex: number, currentGoals: GoalsInterface[]) => {
    try {
      dispatch(setLoadingTrue());     
      const goalToRemove = currentGoals.find((_, i) => i+1 === goalIndex+1);
      
      const newGoals = currentGoals.filter((_, i) => i+1 !== goalIndex+1);     
      if(login){
        await updateItems({
          collectionName: "users",
          userId: login?.uid,
          dataToUpdated: {
            goals: newGoals,
          },
        })
        await deleteItem(
          {
            collectionName: "tasks",
            filters: [
              { field: "userId", operator: "==", value: login?.uid },
              { field: "goalName", operator: "==", value: goalToRemove?.name }
            ],
            updateStates: [
              setUser({ ...(user || {}), goals: newGoals}),
              removeTaskWithGoalName({ title: goalToRemove?.name }),
              removeCalendarTasksByGoalName({ goalToRemove: goalToRemove?.name }),
            ],
          },
          dispatch
        );

      }
    } catch (e) {
      console.log("Delete error:", e);
    }finally{
      dispatch(setLoadingFalse());
    }
  };

  const deleteAccount = async (router: Router, dispatch: AppDispatch, userId: string) => {
    try {
      dispatch(setLoadingTrue());
      await deleteItem(
        {
          collectionName: "chat",
          filters: [
            { field: "userId", operator: "==", value: userId },
          ],
        },
      );
      await deleteItem(
        {
          collectionName: "tasks",
          filters: [
            { field: "userId", operator: "==", value: userId },
          ],
        },
      );
      deleteDoc(doc(db, "users", userId));
      auth.currentUser?.delete();
      logout(router, dispatch);
      alert(t("deleteAccountAlertTry"));
      return true;
    } catch (err) {
      alert(t("deleteAccountAlertCatch") + ` ${err}`);
      console.error("Error deleting user account:", err);
      return false;
    } finally {
      dispatch(setLoadingFalse());
    }
  };
  return (
    <PaperProvider>
      <SafeAreaView className="flex-1 bg-white">
        <AppHeader moduleName={t("modulesNames.profile")} data={user} />
        <ScrollView>
          <FlashList
            data={data}
            renderItem={({ item }) => (
              <View className="flex-1 items-center">
                <Card.Title
                    title={item.title}
                    titleStyle={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}
                    subtitle={typeof item.subtitle === "object" ? 
                      <View className="flex-row flex-wrap">
                        {item.subtitle.map((goal: GoalsInterface, index: number) => (
                          <View key={index} style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{color: "black"}} key={index} className="text-base mr-1">
                              {index+1 + " - "+goal?.name + " for "+ goal?.deadline}{index + 1 < item.subtitle.length - 1 ? ',' : ''}
                            </Text>
                            <IconButton 
                              icon={"history"} 
                              iconColor="black" 
                              size={24} 
                              onPress={
                                () => setHistoryVisible(true)
                              }
                            />
                            {historyVisible && <GoalHistoryModal goalInfo={goal} visible={historyVisible} hideModal={hideGoalHistoryModal} />}
                            {
                              loading ?             
                                <ActivityIndicator
                                  color="red"
                                  size={20}
                                  style={{marginHorizontal: 5}}
                                /> :
                                <IconButton 
                                  icon={"trash-can-outline"} 
                                  iconColor="red" 
                                  size={24} 
                                  onPress={
                                    () => setDeleteGoalOpenModal(true)
                                  }
                                />
                            }
                            {
                              deleteGoalOpenModal &&
                                <AlertVerification
                                  title={t("deleteGoal.title")}
                                  body={t("deleteGoal.body")}
                                  icon={'trash-can-outline'}
                                  visible={deleteGoalOpenModal} 
                                  onConfirm={
                                    () => deleteGoal(index, item.subtitle)
                                  }
                                  onCancel={
                                    () =>setDeleteGoalOpenModal(false)
                                  }
                                  cancel
                                  action= "delete"
                                />
                            } 
                          </View>
                        ))}
                      </View>
                      :
                      <Text style={{color: "black"}} className="text-base">
                        {item.subtitle}
                      </Text>
                    }
                    left={(props) => <Avatar.Icon {...props} icon={item.icon} style={{
                      backgroundColor: PRIMARY_COLOR,
                    }} 
                    />}
                    />
              </View>
            )}
            />
          <Button 
            textColor="white" 
            style={{marginTop: 10, marginHorizontal: 20 }} 
            mode="contained" 
            buttonColor={PRIMARY_COLOR} 
            onPress={
              showChangePassModal
            }
          >
            {t("profile.changePassword")}
          </Button>
          <Button
            textColor = "white" 
            style = {{ marginHorizontal: 20, marginVertical: 10 }} 
            mode = "contained" 
            buttonColor = {loading ? RED+"50" : RED} 
            onPress = {
              () => setOpenModal(true)
            }
          >
            {
              loading ? t("profile.DeletingAccount") : t("profile.DeleteAccount")
            }
          </Button>
        </ScrollView>
        <FAB
          icon="pencil"
          color="white"
          style={{
              position: 'absolute',
              margin: 16,
              right: 0,
              bottom: 0,
              backgroundColor: PRIMARY_COLOR,
          }}
          onPress={showModal}
        />
      </SafeAreaView>
      {visible && <EditProfileModal userInfo={user} visible={visible} hideModal={hideModal}  />}
      {visibleChangePass && <ChangePassword visible={visibleChangePass} hideModal={hideChangePassModal} />}
      {
        openModal &&
          <AlertVerification
            title={t("deleteAccount.title")}
            body={t("deleteAccount.body")}
            icon={'trash-can-outline'}
            visible={openModal} 
            onConfirm={
              ()=> deleteAccount(router, dispatch, login?.uid as string)
            }
            onCancel={
              ()=> setOpenModal(false)
            }
            cancel
            action= "delete"
          />
      } 
    </PaperProvider>

  );
}
