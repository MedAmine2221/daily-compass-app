import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { IconButton } from 'react-native-paper';
import { FacebookLink, InstaLink } from "../constants";
import { openLink } from "../utils/functions";

export default function Footer() {
  return (
    <View className='pb-4 items-center'>
        <View className='flex-row bg-white items-center justify-center'>
            <IconButton 
                size={40} 
                icon="facebook" 
                iconColor='#0866ff'
                onPress={()=> openLink(FacebookLink)}             
            />
            <LinearGradient
              colors={["#feda75", "#fa7e1e", "#d62976", "#962fbf", "#4f5bd5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 33,
                height: 33,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <IconButton 
                    size={25} 
                    icon="instagram" 
                    iconColor='white'
                    onPress={()=> openLink(InstaLink)}             
                />
            </LinearGradient>
            <IconButton 
                size={35} 
                icon="google" 
                iconColor='#de493d'
                onPress={()=> openLink("")}             
            />
        </View>
        <View>
            <Text className='text-center text-gray-400 mt-2 mb-4'>
                © 2025 Your Daily Compass. All rights reserved.
            </Text>
            <Text className='text-center text-gray-400 mt-2 mb-4'>
                V1.0.0
            </Text>
        </View>
    </View>
);
}
