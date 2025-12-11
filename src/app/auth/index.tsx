import AuthForm from '@/src/components/auth/AuthForm';
import CheckBox from '@/src/components/CheckBox';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import { AuthDataInterface } from '@/src/constants/interfaces';
import loginSchema from "@/src/schema/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Auth() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthDataInterface>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm<AuthDataInterface>({
    resolver : yupResolver(loginSchema),
    defaultValues: {
      email: authData?.email ?? '',
      password: authData?.password ?? '',
    },
  });
  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView className='flex-1 bg-white'>
      <Header moduleName="auth" />
      <View className="flex-1 justify-center px-4">
        <AuthForm 
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          reset={reset}
          setAuthData={setAuthData}
        />
        <View className='mt-5 flex-row items-center justify-between'>
          <CheckBox 
            text="Remember me" 
            getValues={getValues} 
          />
          <Button onPress={()=>router.push("/forgot-password")} rippleColor={"transparent"}>
            <Text className='font-bold text-black'>
              Forgot Password
            </Text>
          </Button>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  </TouchableWithoutFeedback>
  );
}
