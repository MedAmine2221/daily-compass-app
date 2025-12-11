import { PRIMARY_COLOR } from "@/src/constants/colors";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Privacy() {
    const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-white">
        <View style={{flex:1, backgroundColor: PRIMARY_COLOR}}>
            <Text className="self-center" style={{padding:10, marginTop:10, color: "white", fontWeight: "bold", fontSize: 25}} >
                {t("privacy.title")}
            </Text>
            <Image 
                style={{
                    width:150,
                    height:150,
                    alignSelf: "center",
                    justifyContent:"center",
                    marginTop:20,
                    top:20
                }}  
                source={require("../../../../assets/images/compliant.png")} 
            />
            <ScrollView
                style={{
                    marginBottom:50,
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60,
                    bottom:-80,
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 6,
                }}
            >
                <View className="flex-col p-10">
                    <Text className="text-2xl" style={{fontWeight: "bold"}}>
                        📝 {t("privacy.terms.title")}
                    </Text>
                    <View className="mx-10">
                        <Text className="text-lg" style={{fontWeight: "700"}}>
                            {t("privacy.terms.lastUpdate")}
                        </Text>
                        <Text className="text-lg">
                            {t("privacy.terms.welcome")}                            
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.terms.sections.personalUseTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.terms.sections.personalUseBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.terms.sections.accountTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.terms.sections.accountBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.terms.sections.contentDeletionTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.terms.sections.contentDeletionBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.terms.sections.limitationsTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.terms.sections.limitationsBody")}
                        </Text>
                    </View>
                </View>
                <View className="flex-col px-10">
                    <Text className="text-2xl" style={{fontWeight: "bold"}}>
                        🔒 {t("privacy.privacy.title")}
                    </Text>
                    <View className="mx-10">
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.privacy.sections.collectedDataTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.privacy.sections.collectedDataBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.privacy.sections.dataUsageTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.privacy.sections.dataUsageBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.privacy.sections.dataSharingTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.privacy.sections.dataSharingBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.privacy.sections.securityTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.privacy.sections.securityBody")}
                        </Text>
                        <Text className="text-lg" style={{fontWeight: "bold"}}>
                            {t("privacy.privacy.sections.yourRightsTitle")}
                        </Text>
                        <Text className="mx-5 text-lg">
                            {t("privacy.privacy.sections.yourRightsBody")}
                        </Text>
                    </View>
                </View>
                <View className="flex-col px-10">
                    <Text className="text-2xl" style={{fontWeight: "bold"}}>
                        📧 {t("privacy.contact.title")}
                    </Text>
                    <View className="flex-col px-10">
                        <Text className="mx-5 text-lg">
                            {t("privacy.contact.body")}
                        </Text>
                        <Text className="mx-5 text-lg" style={{fontWeight: "bold"}}>
                            amine.lazreg.dev@gmail.com
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  );
}
