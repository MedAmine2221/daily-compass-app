import AlertVerification from "@/src/components/AlertVerification";
import AppHeader from "@/src/components/AppHeader";
import ExpandableText from "@/src/components/ExpandableText";
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
import { Router, useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Avatar, Button, Card, FAB, IconButton, PaperProvider, Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../../FirebaseConfig";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const login = auth.currentUser;

  const user = useSelector((state: RootState) => state.user.items);
  const [editVisible, setEditVisible] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);

  const [historyGoal, setHistoryGoal] = useState<GoalsInterface | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<{
    index: number;
    goals: GoalsInterface[];
  } | null>(null);

  const { t } = useTranslation();

  const deleteGoal = async (index: number, goals: GoalsInterface[]) => {
    try {
      const goal = goals[index];
      const newGoals = goals.filter((_, i) => i !== index);

      if (login) {
        await updateItems({
          collectionName: "users",
          userId: login.uid,
          dataToUpdated: { goals: newGoals },
        });

        await deleteItem(
          {
            collectionName: "tasks",
            filters: [
              { field: "userId", operator: "==", value: login.uid },
              { field: "goalName", operator: "==", value: goal.name },
            ],
            updateStates: [
              setUser({ ...(user || {}), goals: newGoals }),
              removeTaskWithGoalName({ title: goal.name }),
              removeCalendarTasksByGoalName({ goalToRemove: goal.name }),
            ],
          },
          dispatch
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setGoalToDelete(null);
    }
  };

  const deleteAccount = async (
    router: Router,
    dispatch: AppDispatch,
    userId: string
  ) => {
    try {
      dispatch(setLoadingTrue());

      await deleteItem({
        collectionName: "tasks",
        filters: [{ field: "userId", operator: "==", value: userId }],
      });

      await deleteDoc(doc(db, "users", userId));
      await auth.currentUser?.delete();
      logout(router, dispatch);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoadingFalse());
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView className="flex-1 bg-white">
        <AppHeader moduleName={t("modulesNames.profile")} data={user} />

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* EMAIL */}
          <Card style={{ margin: 12, backgroundColor: "white" }}>
            <Card.Title
              title={t("profile.email")}
              titleStyle = {{ fontWeight: "bold", fontSize: 16,}}
              subtitle={login?.email}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="email"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                />
              )}
            />
          </Card>

          {/* PHONE */}
          <Card style={{ marginHorizontal: 12, backgroundColor: "white" }}>
            <Card.Title
              title={t("profile.phoneNbr")}
              subtitle={user?.phoneNumber || t("profile.userPhone")}
              titleStyle = {{ fontWeight: "bold", fontSize: 16,}}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="phone"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                />
              )}
            />
          </Card>

          {/* GOALS */}
          <Surface
            style={{
              margin: 12,
              padding: 12,
              borderRadius: 12,
              elevation: 2,
              backgroundColor: "white",
            }}
          >
            <View className="flex-row items-center my-4">
              <Avatar.Icon
                icon="target"
                size={45}
                style={{ backgroundColor: PRIMARY_COLOR, height: 45, width: 45 }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 12 }}>
                {t("profile.goals")}
              </Text>
            </View>

            {user?.goals?.length ? (
              user.goals.map((goal, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <ExpandableText
                      text={goal.name}
                      textColor={PRIMARY_COLOR}
                      textSize={14}
                      textWeight="bold"
                      maxChars={25}
                    />
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>
                      {goal.deadline}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="history"
                      size={20}
                      style={{ backgroundColor: "#EEE" }}
                      onPress={() => setHistoryGoal(goal)}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      iconColor="red"
                      style={{ backgroundColor: "#FDECEC" }}
                      onPress={() =>
                        setGoalToDelete({ index, goals: user.goals })
                      }
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ opacity: 0.5 }}>
                {t("profile.goalsNull")}
              </Text>
            )}
          </Surface>

          <Button
            icon="lock"
            style={{ margin: 12, backgroundColor: PRIMARY_COLOR}}
            textColor="white"
            onPress={() => setChangePassVisible(true)}
          >
            {t("profile.changePassword")}
          </Button>

          <Button
            mode="contained"
            style={{ marginHorizontal: 12 }}
            buttonColor={RED}
            onPress={() => setDeleteAccountVisible(true)}
          >
            {t("profile.DeleteAccount")}
          </Button>
        </ScrollView>

        <FAB
          icon="pencil"
          color="white"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            backgroundColor: PRIMARY_COLOR,
          }}
          onPress={() => setEditVisible(true)}
        />
      </SafeAreaView>

      {/* MODALS */}
      {editVisible && (
        <EditProfileModal
          visible
          userInfo={user}
          hideModal={() => setEditVisible(false)}
          deleteGoal={(index: number, goals: GoalsInterface[]) =>
            deleteGoal(index, goals)
          }
        />
      )}

      {changePassVisible && (
        <ChangePassword
          visible
          hideModal={() => setChangePassVisible(false)}
        />
      )}

      {historyGoal && (
        <GoalHistoryModal
          visible
          goalInfo={historyGoal}
          hideModal={() => setHistoryGoal(null)}
        />
      )}

      {goalToDelete && (
        <AlertVerification
          title={t("deleteGoal.title")}
          body={t("deleteGoal.body")}
          icon="trash-can-outline"
          visible
          onConfirm={() =>
            deleteGoal(goalToDelete.index, goalToDelete.goals)
          }
          onCancel={() => setGoalToDelete(null)}
          cancel
          action="delete"
        />
      )}

      {deleteAccountVisible && (
        <AlertVerification
          title={t("deleteAccount.title")}
          body={t("deleteAccount.body")}
          icon="trash-can-outline"
          visible
          onConfirm={() =>
            deleteAccount(router, dispatch, login?.uid as string)
          }
          onCancel={() => setDeleteAccountVisible(false)}
          cancel
          action="delete"
        />
      )}
    </PaperProvider>
  );
}
