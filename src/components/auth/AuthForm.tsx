import { PRIMARY_COLOR } from '@/src/constants/colors';
import { AuthDataInterface, AuthFormsPropsInterface } from '@/src/constants/interfaces';
import { RootState } from '@/src/redux/store';
import { getData, signIn } from '@/src/utils/functions';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AppInput from '../AppInput';
export default function AuthForm({ 
  control, 
  errors, 
  handleSubmit, 
  reset, 
  setAuthData 
}: AuthFormsPropsInterface ) {
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getData({ key: "profile" });
      if (profile) {
        reset(profile);
      }
    };
    loadProfile();
  }, [reset]);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.loading.loading);
  const { t } = useTranslation()
 
  return (
    <View className='mx-8 bg-white'>
      <AppInput 
          control={control} 
          errors={errors} 
          name='email' 
          label='E-mail' 
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
      <View className='mt-4'>
        <Button
          icon={!loading ? "login" : undefined}
          theme={{ colors: { primary: loading ? PRIMARY_COLOR+"50": PRIMARY_COLOR } }}
          mode="contained"
          onPress={handleSubmit((data: AuthDataInterface) => signIn(dispatch, router, t, data, setAuthData, false))}
          style={{ marginBottom: 10, width:"75%", alignSelf: "center" }}
          >
          {!loading ? 
            <Text style={{color: "white"}}>
              Sign In
            </Text>
            :
            <ActivityIndicator color={PRIMARY_COLOR} size={25}/>
          }
        </Button>
        <Button
          theme={{ colors: { outline: PRIMARY_COLOR } }}
          style={{ borderWidth: 2, width:"75%", alignSelf: "center" }}
          mode="outlined"
          onPress={() => router.push('/sign-up')}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
}
