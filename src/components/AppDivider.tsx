import React from 'react';
import { Text, View } from 'react-native';

export default function AppDivider() {
  return (
    <View className='flex-row items-center justify-center mt-10'>
        <View className='border-[0.8px] border-gray-300 w-40'/>
        <Text className='text-center text-gray-500 mx-2'>OR</Text>
        <View className='border-[0.8px] border-gray-300 w-40'/>
    </View>
  );
}
