import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from "react-native";
import { Icon, Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/functions';

export default function AppHeaderMenu() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation()
  return (
    <View className='bg-white rounded-lg shadow-lg'>
      <Menu.Item 
        leadingIcon={() => <Icon source={"account"} size={24} color="black" />}        
        onPress={() => router.navigate("/(tabs)/profile")} 
        title={t("headerMenu.profile")}
        titleStyle={{ color: 'black' }}
        style={{ marginTop: 10 }}
      />
      <Menu.Item 
        leadingIcon={() => <Icon source={"cog"} size={24} color="black" />}        
        onPress={() => router.navigate("/(tabs)/Settings")} 
        title={t("headerMenu.settings")}  
        titleStyle={{ color: 'black' }}
      />
      <Menu.Item 
        leadingIcon={() => <Icon source={"logout"} size={24} color="red" />}
        onPress={() => {
          logout(router, dispatch);
        }} 
        title={t("headerMenu.logout")}  
        titleStyle={{ color: 'red', fontWeight: '600' }}
        style={{ marginBottom: 10 }}
      />
    </View>
  );
}
