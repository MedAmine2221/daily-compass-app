import { auth } from '@/FirebaseConfig';
import AppInput from '@/src/components/AppInput';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import { setLoadingFalse, setLoadingTrue } from '@/src/redux/loadingReducer';
import { RootState } from '@/src/redux/store';
import { forgotPasswordSchema } from '@/src/schema/forgotPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const {control, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(forgotPasswordSchema(t)),
    });
    const dispatch = useDispatch();
    const router = useRouter()
    const loading = useSelector((state: RootState)=>state.loading.loading)
    const onForgotPassword = async (email: string) => {
        try {
            dispatch(setLoadingTrue());
            await sendPasswordResetEmail(auth, email);
            alert(t("onForgotPasswordAlert"));
        } catch (error: any) {
            console.error("Forgot password error:", error);
        }finally{
            dispatch(setLoadingFalse());
            router.push("/auth");
        }
    };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView className='flex-1 bg-white flex-col justify-between'>
            <Header moduleName="forgotPassword"/>
            <View className='mx-8 bg-white'>
                <AppInput
                    control={control} 
                    errors={errors} 
                    name='email' 
                    label='E-mail' 
                    icon="email"
                />
                <View className='mt-5'/>
                <Button
                  theme={{ colors: { primary: loading ? PRIMARY_COLOR +"50" : PRIMARY_COLOR } }}
                  mode="contained"
                  icon={loading ? undefined : "send-variant"}
                  onPress={handleSubmit((data) => onForgotPassword(data.email))}
                  style={{ marginBottom: 10, width:"75%", alignSelf: "center",  }}
                  labelStyle={{ fontSize: 16 }}
                  >
                  {loading ? "sending ... ": "send"}
                </Button> 
                <Text className='mt-5 self-center' style={{fontSize: 15}}>Already have your password ? 
                    <Text style={{fontWeight: "bold", fontSize: 15}} onPress={()=> router.replace("/auth")}>
                        {" Sign in "}
                  </Text>
                </Text>
            </View>
            <Footer />   
        </SafeAreaView>
    </TouchableWithoutFeedback>
);
}
