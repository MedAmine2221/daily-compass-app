import { AnimatedTabIcon } from '@/src/components/tabLayout/AnimatedTabIcon';
import { FloatingIndicator } from '@/src/components/tabLayout/FloatingIndicator';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import i18n from '@/src/i18n';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const [activeIndex, setActiveIndex] = useState(1);
  const user = useSelector((state: any) => state.user.items);
  useEffect(() => {    
    if (user?.lang) {
      i18n.changeLanguage(user.lang);
    }
  }, [user]);
  const { t } = useTranslation();
  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            paddingBottom: 12,
            paddingTop: 16,
            height: 85,
          },
          tabBarLabelStyle: {
            fontSize: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
          tabBarBackground: () => (
            <View className="flex-1 rounded-[32px] overflow-hidden">
              <FloatingIndicator activeIndex={activeIndex} />
            </View>
          ),
        }}
        screenListeners={{
          state: (e) => {
            const index = e.data.state.index;
            setActiveIndex(index);
          },
        }}
      >
        <Tabs.Screen
          name="profile/index"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon
                name="person-circle-outline" 
                focused={focused} 
                size={24} 
                label={t('navBar.profile')}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="welcom"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon 
                name="home-outline" 
                focused={focused} 
                size={24} 
                label={t('navBar.home')}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings/index"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon 
                name="settings-outline" 
                focused={focused} 
                size={24}
                label={t('navBar.settings')}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(hidden)"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}