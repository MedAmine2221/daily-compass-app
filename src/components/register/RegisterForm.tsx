import { auth, db } from '@/FirebaseConfig';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import { LANG } from '@/src/constants/enums';
import { setLoadingFalse, setLoadingTrue } from '@/src/redux/loadingReducer';
import { RootState } from '@/src/redux/store';
import signupSchema from '@/src/schema/signupSchema';
import createMessage from '@/src/utils/functions';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AppInput from '../AppInput';

export default function RegisterForm() {
    const {control, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(signupSchema),
    });
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const loading = useSelector ((state: RootState) => state.loading.loading);
    const router = useRouter()
    const onSubmit = async (data: any) => {
        dispatch(setLoadingTrue());
        const { email, confirmPassword, username } = data;
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, confirmPassword);
          const user = userCredential.user;
          await setDoc(doc(db, "users", user.uid), {
            username: username,
            phoneNumber: "",
            address: "",
            imageUrl:"",
            goals: [],
            lang: LANG.FR,
            createdAt: new Date().toISOString(),
          })
          await createMessage({
            sender: "bot",
            text: t("chat.firstMsgBot"),
            time: new Date().toLocaleTimeString([], {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          })
          Alert.alert('Success', 'Account created successfully!');
        } catch (error: any) {
          Alert.alert('Registration failed', error.message);
        }finally {
          dispatch(setLoadingFalse());
          router.replace('/auth');
        }
    };
  return (
    <View className='mx-8 bg-white'>
        <AppInput 
            control={control} 
            errors={errors} 
            name='username' 
            label='username' 
            icon="account"
        />
        <AppInput 
            control={control} 
            errors={errors} 
            name='email' 
            label='email' 
            icon="email"
        />
        <AppInput 
            control={control} 
            errors={errors} 
            name='password' 
            label='password' 
            secureTextEntry 
            icon="lock"
        />        
        <AppInput 
            control={control} 
            errors={errors} 
            name='confirmPassword' 
            label='Confirm Password' 
            secureTextEntry 
            icon="lock"
        /> 
        <Button
          theme={{ colors: { primary: loading ? PRIMARY_COLOR+"50": PRIMARY_COLOR } }}
          mode="contained"
          onPress={handleSubmit((data) => onSubmit(data))}
          style={{ margin: 20, width:"75%", alignSelf: "center",  }}
          labelStyle={{ fontSize: 16 }}
        >
        {!loading ? 
          <Text style={{color: "white"}}>
            Register
          </Text>
          :
          <ActivityIndicator color={"white"} size={25}/>
        }
        </Button>
        <Text className='self-center' style={{fontSize: 15}}>Already have an account ? 
          <Text style={{fontWeight: "bold", fontSize: 15}} onPress={()=> router.replace("/auth")}>
            {" Sign in "}
          </Text>
        </Text>
    </View>
);
}
