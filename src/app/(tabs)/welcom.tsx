import AppHeader from "@/src/components/AppHeader";
import { FlashList } from "@shopify/flash-list";
import { RelativePathString, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcom() {
  const router = useRouter();
  const { t } = useTranslation();  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader moduleName={t("modulesNames.welcome")}/>
      <FlashList
        data={[
          {moduleName:"To-Do", image: require("../../assets/images/ToDoList.png")},
          {moduleName:"Chat", image: require("../../assets/images/Chat.png") },
          {moduleName:"Calendar", image: require("../../assets/images/Calendar.png") },
          {moduleName:"Statistic", image: require("../../assets/images/Exploration.png") },
          {moduleName:"Settings", image: require("../../assets/images/Settings.png") },
        ]}
        numColumns={4}
        renderItem={({ item }) => (
          <View className="flex-1 my-5 items-center">
            <Button onPress={
              () => router.push(`/${item.moduleName}` as RelativePathString)
              } >
              <Image source={item.image} 
                className="w-16 h-16 bg-white"
              />
            </Button>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
