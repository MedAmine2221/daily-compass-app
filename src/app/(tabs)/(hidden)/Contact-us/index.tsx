import { PRIMARY_COLOR } from "@/src/constants/colors";
import { openLink } from "@/src/utils/functions";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ContactUs() {
    const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-white">
        <View style={{flex:1, backgroundColor: PRIMARY_COLOR}}>
            <Text className="self-center" style={{padding:10, marginTop:10, color: "white", fontWeight: "bold", fontSize: 25}} >{t("contact.title")}</Text>
            <Image 
                style={{
                    width:150,
                    height:150,
                    alignSelf: "center",
                    justifyContent:"center",
                    marginTop:20,
                    top:20
                }}  
                source={require("../../../../assets/images/social-media.png")} 
            />
            <View className="bg-white h-[65%]"
                style={{
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
                <View className="flex-row justify-center m-5 ">
                    <View style={{alignItems:"center", justifyContent:"center", margin:10, backgroundColor: "#6b7280", borderRadius:100, width:50, height:50}}>
                        <IconButton icon={"phone"} size={30} iconColor="white" onPress={()=>openLink("tel: +216 53 739 484")}/>
                    </View>
                    <View style={{alignItems:"center", justifyContent:"center", margin:10, backgroundColor: "#6b7280", borderRadius:100, width:50, height:50}}>

                        <IconButton icon={"linkedin"} size={30} iconColor="white" onPress={()=>openLink("https://www.linkedin.com/in/mohamed-amine-lazreg-831b1817a/")} />
                    </View>
                    <View style={{alignItems:"center", justifyContent:"center", margin:10, backgroundColor: "#6b7280", borderRadius:100, width:50, height:50}}>

                        <IconButton icon={"github"} size={30} iconColor="white" onPress={()=>openLink("https://github.com/MedAmine2221")} />
                    </View>
                    {/* <View style={{alignItems:"center", justifyContent:"center", margin:10, backgroundColor: "#6b7280", borderRadius:100, width:50, height:50}}>
                        <IconButton icon={"web"} size={30} iconColor="white" onPress={()=>openLink("")} />
                    </View> */}
                </View>
                <View className="border-[0.5px] border-gray-700 w-full mb-5"/>
                <Text style={{color:"#6b7280", fontWeight:"bold", padding:5, fontSize:20}}> {t("contact.contactDeveloper")} </Text>
                <View className="m-5 justify-center">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-[18px] font-bold text-primary w-[110px]" style={{color:PRIMARY_COLOR, fontWeight: "bold"}}>
                            {t("contact.emailLabel")}
                        </Text>
                        <Text className="text-[16px]">amine.lazreg.dev@gmail.com</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Text className="text-[18px] font-bold text-primary w-[110px]" style={{color:PRIMARY_COLOR, fontWeight: "bold"}}>
                            WhatsApp :
                        </Text>
                        <Text className="text-[16px]">+216 53 739 484</Text>
                    </View>
                </View>
                {/* <View className="items-center justify-center">
                    <Image source={require("../../../../assets/images/qr-code.png")} style={{width: 100, height: 100}} />
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 16,
                            textAlign: "center",
                            marginTop: 20,
                            paddingHorizontal: 10,
                        }}
                    >
                        {t("contact.qrTitle")}
                    </Text>
                </View> */}
            </View>
        </View>
    </SafeAreaView>
  );
}
