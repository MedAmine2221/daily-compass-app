import { auth } from "../../FirebaseConfig";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import { changePassSchema } from "@/src/schema/changePassword";
import { logout } from "@/src/utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AlertVerification from "../AlertVerification";
import AppInput from "../AppInput";

export default function ChangePassword({ visible, hideModal }: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter()
  const loading = useSelector((state: RootState)=> state.loading.loading)
  const [openModal, setOpenModal] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(changePassSchema(t))
  });


  const onSubmit = async (data: any) => {    

    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error("User not logged in");
      }
      dispatch(setLoadingTrue());
      // Credential created using the old password
      const credential = EmailAuthProvider.credential(user.email, data.oldPassword);

      // Mandatory re-authentication
      await reauthenticateWithCredential(user, credential);

      // Password update
      await updatePassword(user, data.confirmNewPassword);

      closeModal();
      logout(router, dispatch);

    } catch (err: any) {
      console.error("Error changing password:", err);
      console.log("err.code ",err.code);
      
      if (err.code === "auth/invalid-credential") {
        alert(t("changePasswordAlerts.wrongOldPassword"));
      } else if (err.code === "auth/weak-password") {
        alert(t("changePasswordAlerts.weakNewPassword"));
      } else if (err.code === "auth/requires-recent-login") {
        alert(t("changePasswordAlerts.requiresRecentLogin"));
      } else {
        alert(t("changePasswordAlerts.genericError"));
      }
    }

    dispatch(setLoadingFalse());
  };

  const closeModal = () =>{
    setOpenModal(false);
    reset();
    dispatch(setLoadingFalse());
    hideModal();
  }
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
            {t("changePassword.title")}
          </Text>
          <AppInput
            control={control}
            errors={errors}
            name="oldPassword"
            secureTextEntry
            label={t("changePassword.oldPass")}
            icon="lock"
          />
          <AppInput
            control={control}
            errors={errors}
            name="newPassword"
            secureTextEntry
            label={t("changePassword.newPass")}
            icon="lock"
          />
          <AppInput
            control={control}
            errors={errors}
            name="confirmNewPassword"
            secureTextEntry
            label={t("changePassword.confirmNewPass")}
            icon="lock"
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
                  {t("changePassword.submit")}
                </Text>
              }
            </Button>
          </View>
        </ScrollView>
        {openModal && <AlertVerification
          title={t("verifyChangePassword.title")}
          body={t("verifyChangePassword.body")}
          icon={'pencil'}
          visible={openModal}
          onConfirm={handleSubmit(onSubmit)}
          onCancel={()=>{setOpenModal(false)}}
          cancel
          action= "update"
        />}
      </Modal>

    </Portal>
  );
}
