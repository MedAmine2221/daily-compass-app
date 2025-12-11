import { auth } from '@/FirebaseConfig';
import AppInput from '@/src/components/AppInput';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import { setLoadingFalse, setLoadingTrue } from '@/src/redux/loadingReducer';
import { RootState } from '@/src/redux/store';
import forgotPasswordSchema from '@/src/schema/forgotPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function ForgotPassword() {
    const {control, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(forgotPasswordSchema),
    });
    const dispatch = useDispatch();
    const router = useRouter()
    const loading = useSelector((state: RootState)=>state.loading.loading)
    const onForgotPassword = async (email: string) => {
        
        try {
            dispatch(setLoadingTrue());
            await sendPasswordResetEmail(auth, email);
            alert("Un email de réinitialisation du mot de passe vous a été envoyé.");
        } catch (error: any) {
            console.log("Forgot password error:", error);
            if (error.code === "auth/user-not-found") {
                alert("Aucun compte n'est associé à cet email.");
            } else if (error.code === "auth/invalid-email") {
                alert("L'adresse email est invalide.");
            } else {
                alert("Une erreur est survenue, veuillez réessayer.");
            }
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
            </View>
            <Footer />   
        </SafeAreaView>
    </TouchableWithoutFeedback>
);
}
