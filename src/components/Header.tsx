import React from 'react';
import { Image, Text, View } from "react-native";
export default function Header({moduleName}:{moduleName?: string}) {
  return (
    <View className='items-center'>
      <Image
        className='w-full h-52'
        source={require('../assets/images/logo.png')}
      />
      <Text className='text-4xl font-extrabold text-black text-center'>
        {moduleName ==="auth" ? "Log in" : moduleName === "forgotPassword" ? "Forgot Password" : moduleName === "OTPVerification" ? "Phone Number Verification" : "Create Account"}
      </Text>
      <Text className='text-lg font-bold text-gray-400 text-center p-2 mt-5'>
        {moduleName ==="auth" ? "Enter your username and password to securely access your account and manage your services" : moduleName === "forgotPassword" ? "Enter your phone number to receive a verification code by SMS and confirm your identity to reset your password." : "Create a new account to get started and enjoy seamless access to our features"}
      </Text>
    </View>
);
}
