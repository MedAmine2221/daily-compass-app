import { auth } from "@/FirebaseConfig";
import AppHeader from "@/src/components/AppHeader";
import { flags } from "@/src/constants";
import { PRIMARY_COLOR } from "@/src/constants/colors";
import { setUser } from "@/src/redux/user/userReducer";
import { updateItems } from "@/src/utils/functions";
import { FlashList } from "@shopify/flash-list";
import { RelativePathString, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Avatar, Card, IconButton, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
export default function Settings() {
  const user = auth.currentUser;
  const router = useRouter()
  const profile = useSelector((state: any) => state.user.items)
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isSwitchOn, setIsSwitchOn] = useState(profile?.emailNotification);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn)
  }
  const pushEmail = async () => {
    if(user){
      if(!isSwitchOn === true){
        await updateItems({
          collectionName: "users", 
          userId: user?.uid, 
          dataToUpdated: {
            emailNotification: true,
          }
        }, dispatch, setUser({ ...profile, emailNotification: true }))
      }
      else{
        await updateItems({
          collectionName: "users", 
          userId: user?.uid, 
          dataToUpdated: {
            emailNotification: false,
          }
        }, dispatch, setUser({ ...profile, emailNotification: true }))
      }
    }
  }

  const changeLanguage = async (lang: string, t: any) => {
    if (!user) return alert(t("changeLanguageAlert"));
    await updateItems({
      collectionName: "users", 
      userId: user?.uid, 
      dataToUpdated: { lang: lang }
    }, dispatch, setUser({ ...profile, lang }))    
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader moduleName={t("modulesNames.settings")} data={profile}/>
      <FlashList
        data={[
          { title: t("language") , leftIcon: "translate", rightIcon: "arrow-right-thin", leftIconColor: "#ff960d", settingType: "lang" },
          // { title: "Dark Mode", leftIcon: "white-balance-sunny", rightIcon: "arrow-right-thin", leftIconColor: "#017cfd", settingType: "Preferences" },
          { title: t("settings.emailNotif"), leftIcon: "email-arrow-right", rightIcon: "alternate-email", leftIconColor: "#39c95b", settingType: "Preferences" },
          // { title: "Push Notifications", leftIcon: "message-text-outline", rightIcon: "arrow-right-thin", leftIconColor: "#39c95b", settingType: "Preferences" },
          { title: t("contact.title"), leftIcon: "contacts", rightIcon: "chevron-right", settingType: "Resources", leftIconColor: "#017cfd", rootName:"Contact-us" },
          { title: t("rating.rateApp"), leftIcon: "star-outline", rightIcon: "chevron-right", settingType: "Resources", leftIconColor: "#ff960d", rootName:"Rating" },
          { title: t("privacy.title"), leftIcon: "file-document-outline", rightIcon: "chevron-right", settingType: "Resources", leftIconColor: "#8e8d92", rootName:"Privacy" },
        ]}
        style={{marginBottom: 5}}
        renderItem={({ item }) => (
          <View className="flex-1 bg-white rounded-3xl m-1 border-gray-200 border-2">
            <Card.Title
              title={item.title}
              titleStyle={{ 
                textAlign: "left", 
                fontWeight: "600",                 
                fontSize: 16,
                top: 2,
              }}
              left={(props) => (
                <Avatar.Icon
                {...props}
                icon={item.leftIcon}
                color="white"
                size={40}
                style={{
                  backgroundColor: item.leftIconColor,
                  marginLeft: 10,
                }}
                />
              )}
              right={(props) => (
                <View className="flex-row items-center pr-5">
                  {item.settingType === "lang" ? (
                    <Dropdown
                      style={{
                        height: 40,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        paddingHorizontal: 10,
                        backgroundColor: '#f9fafb',
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 2,
                        minWidth: 120,
                      }}
                      placeholder="Select Languange"
                      placeholderStyle={{ fontSize: 14, color: '#6b7280' }}
                      selectedTextStyle={{ fontSize: 14, color: '#111827', fontWeight: '500' }}
                      iconStyle={{ width: 20, height: 20, tintColor: '#6b7280' }}
                      value={profile?.lang}
                      data={flags}
                      labelField="name"
                      valueField="lang"
                      onChange={(item) => {
                        changeLanguage(item.lang, t);
                      }}
                    />

                    ): item.settingType === "Preferences" ? (
                    <Switch
                      value={isSwitchOn}
                      onValueChange={async ()=>{
                        onToggleSwitch();
                        await pushEmail();
                      }
                      }
                      color= { PRIMARY_COLOR }
                      />
                    ): (
                      <IconButton
                        {...props}
                        icon={item.rightIcon}
                        iconColor="gray"
                        size={40}
                        style={{
                          backgroundColor: "transparent",
                        }}
                        onPress={() => router.push(`/(tabs)/(hidden)/${item.rootName}` as RelativePathString)}
                      />
                    )}
                </View>
              )}
              />
          </View>
        )}
        />
    </SafeAreaView>
  );
}
