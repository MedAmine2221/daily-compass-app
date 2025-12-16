import { auth } from "@/FirebaseConfig";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Avatar, Button, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../constants/colors";
import { setLoadingFalse, setLoadingTrue } from "../redux/loadingReducer";
import { RootState } from "../redux/store";
import { setUser } from "../redux/user/userReducer";
import { pickImageFromGallery, updateItems, uploadImageToCloudinary } from "../utils/functions";
import AppHeaderMenu from "./HeaderMenu";

export default function AppHeader({
  moduleName,
  data,
}: {
  moduleName?: string;
  data?: any;
}) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const user = useSelector((state: RootState) => state.user.items);
  const loading = useSelector((state: RootState) => state.loading.loading);
  const dispatch = useDispatch();

  const updatePhoto = async () => {
    try {
      dispatch(setLoadingTrue());
      const selectedImgUri = await pickImageFromGallery(t);
      if (!selectedImgUri) return;
      
      // Upload sur Firebase Storage
      const downloadUrl = await uploadImageToCloudinary(selectedImgUri);
      if (!downloadUrl) return;
      
      const firebaseUser = auth.currentUser;
      if(user){ 
        await updateItems({
          collectionName: "users", 
          userId: firebaseUser!.uid, 
          dataToUpdated: { imageUrl: downloadUrl }
        }, dispatch, setUser({ ...(user as any), imageUrl: downloadUrl })) 
      }
    } catch (error) {
      Alert.alert(t("updatePhotoAlert"), error)
    } finally {
      dispatch(setLoadingFalse());
    }
  };
  const toggleMenu = () => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.spring(fadeAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <View
      className={`relative ${moduleName === t("modulesNames.toDo") ? "" : "rounded-b-3xl"} pb-8`}
      style={{
        backgroundColor: PRIMARY_COLOR,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="w-full flex-row justify-between items-center px-5">
        <View>
          <Text className="text-white text-xl font-semibold opacity-80">
            {moduleName ? "Module" : t("modulesNames.welcome")}
          </Text>
          <Text className="text-white text-3xl font-extrabold tracking-tight">
            {moduleName || data?.displayName || "User"}
          </Text>
        </View>

        <IconButton
          icon={isVisible ? "close" : "menu"}
          size={30}
          iconColor="white"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 18,
          }}
          onPress={toggleMenu}
        />
      </View>

      {moduleName === t("modulesNames.profile") || moduleName === t("modulesNames.settings") ? (
        <View className="justify-center items-center mt-8">
          <View
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <Image
              source={
                data?.imageUrl
                  ? { uri: data?.imageUrl }
                  : require("../assets/images/user.png")
              }
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: "#fff",
                backgroundColor: "#5F5CE0",
                opacity: loading ? 0.6 : 1, // dimmer pendant upload

              }}
            />
            {loading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 120,
                  height: 120,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 60,
                  backgroundColor: "rgba(0,0,0,0.25)",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>

          {moduleName === t("modulesNames.profile") && (
            <Button
              mode="outlined"
              textColor="#fff"
              style={{
                borderColor: "white",
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 20,
              }}
              labelStyle={{ fontWeight: "bold" }}
              onPress={ updatePhoto }
              rippleColor={"transparent"}
            >
              {t("header.editPhoto")}
            </Button>
          )}

          <Text className="text-white text-xl font-bold mt-4">
            {user?.username || t("header.userName")}
          </Text>
          <Text className="text-white text-xl font-medium">
            {user?.lang || t("header.userLang")}
          </Text>
          <Text className="text-white opacity-80 text-base mt-1">
            {user?.address || t("header.userAdress")}
          </Text>
        </View>
      ) : (
        <View className="justify-center items-center mt-10">
          <Text className="text-white text-3xl font-extrabold">
            {t("header.title")}
          </Text>
          <Text className="text-white text-lg opacity-90 mt-2">
            {t("header.body")} ✨
          </Text>
          <Avatar.Image
            size={100}
            source={require("../assets/images/white-compass.png")}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              marginTop: 20,
            }}
          />
        </View>
      )}

      {/* Menu Overlay */}
      {isVisible && (
        <Pressable
          onPress={toggleMenu}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}

      {/* Floating Menu */}
      {isVisible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 90,
            right: 20,
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          <AppHeaderMenu />
        </Animated.View>
      )}
    </View>
  );
}
