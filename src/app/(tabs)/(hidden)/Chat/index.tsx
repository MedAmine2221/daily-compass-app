import { auth } from "@/FirebaseConfig";
import AppHeader from "@/src/components/AppHeader";
import AppInput from "@/src/components/AppInput";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { ChatBotInterface, Message } from "@/src/constants/interfaces";
import { setLoadingFalse, setLoadingTrue } from "@/src/redux/loadingReducer";
import { RootState } from "@/src/redux/store";
import chatbotSchema from "@/src/schema/chatbotSchema";
import createMessage, { gemini, renderMessageText } from "@/src/utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import LoadingDots from "react-native-loading-dots";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ChatBot() {
  const user = auth.currentUser;
  const messages = useSelector((state: RootState) => state.chat.messages);
  const loading = useSelector((state: RootState) => state.loading.loading);
  const scrollViewRef = useRef<FlashList<any>>(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(chatbotSchema),
  });

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const submit = async (data: ChatBotInterface) => {
    
    reset();
    const time = new Date().toLocaleTimeString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    createMessage({ sender: "user", text: data.prompt, time: time});
    const botMessage = { sender: "bot", text: "", time };
    dispatch(setLoadingTrue());
    const response = await gemini(data.prompt);
    if (response === null) {
      createMessage({ ...botMessage, text: "Retrail" });
      dispatch(setLoadingFalse());
      return;
    }
    createMessage({ ...botMessage, text: response });
    dispatch(setLoadingFalse());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View
        className="flex-1"
        onStartShouldSetResponder={() => {
          Keyboard.dismiss();
          return false;
        }}
      >
        <SafeAreaView className="bg-white">
          <AppHeader moduleName={t("modulesNames.chatbot")} />

        </SafeAreaView>
        <FlashList
          ref={scrollViewRef}
          data={[...messages].sort(
            (a, b) =>
              new Date(a.createdAt as Date).getTime() -
              new Date(b.createdAt as Date).getTime()
          )}
          keyExtractor={(_, index) => index.toString()}
          className="bg-white"
          renderItem={({ item, index }: { item: Message; index: number }) => (
            <View
              key={index}
              className={`${
                item?.sender === "user" ? 
                  "flex-row items-end justify-end" : 
                  item?.sender === "bot" && item.text !== "Retrail" ? 
                    "flex-row items-end justify-start" : 
                    "flex-row items-center justify-center"
              }`}
            >
              {item?.sender === "bot" && item.text !=="Retrail" && (
                <Image
                  source={require("../../../../assets/images/bot.png")}
                  className="w-[45px] h-[45px] rounded-full mr-2"
                />
              )}
              {item.sender === "bot" && item.text=== "Retrail" ?(
                <View
                  className={'w-[80%] border-[1px] border-red-300 rounded-2xl mt-3 px-4 py-3 bg-red-100'}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      style={{ color: "#dc2626" }}
                      className="text-xl"
                      >
                      {item?.text}
                    </Text>
                    <IconButton
                      icon="reload"
                      iconColor={"black"}
                      size={24}
                    />
                  </View>
                  <Text
                    style={{
                      color: "#dc2626",
                    }}
                    className="text-xs mt-1 self-end"
                  >
                    {item?.time}
                  </Text>
                </View>
              ) : (
                <View
                  className={`max-w-[80%] rounded-t-2xl mt-3 ${
                    item?.sender === "user" ? "rounded-l-2xl" : "rounded-r-2xl"
                  } px-4 py-3 ${
                    item?.sender === "user" ? "bg-primary" : "bg-gray-300"
                  }`}
                  style={item?.sender === "user" ? { backgroundColor: PRIMARY_COLOR } : {}}
                >
            
                  {renderMessageText(item?.text, item)}
                  <Text
                    style={{
                      color: item?.sender === "user" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
                    }}
                    className="text-xs mt-1 self-end"
                  >
                    {item?.time}
                  </Text>
                </View>
              )
              }
              {item?.sender === "user" && (
                <Image
                  source={user?.photoURL ? { uri: user.photoURL } : require("../../../../assets/images/user.png")}
                  className="w-[45px] h-[45px] rounded-full ml-2"
                />
              )}
            </View>
          )}
        />
        {loading && (
          <View className="bg-white flex-row items-end justify-start">
            <Image
              source={require("../../../../assets/images/bot.png")}
              className="w-[45px] h-[45px] rounded-full mr-2"
            />
            <View
              className="max-w-[80%] rounded-t-2xl rounded-r-2xl px-4 py-3 bg-gray-300"
            >
              <LoadingDots
                size={10}
                dots={3}
                colors={["#374151", "#374151", "#374151"]}
                bounceHeight={2}
              />
            </View>
          </View>
        )}
        <View className="flex-row px-4 bg-white">
          <View className="flex-1">
            <AppInput
              control={control}
              errors={errors}
              name="prompt"
              label={t("chat.prompt")}
              icon="message"
              multiline
            />
          </View>
          {loading ? (
            <ActivityIndicator
              color={PRIMARY_COLOR}
              size={28}
              style={{ top: -10 }}
            />
          ) : (
            <IconButton
              icon="send"
              iconColor={PRIMARY_COLOR}
              size={32}
              onPress={handleSubmit(submit)}
              rippleColor={"transparent"}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}