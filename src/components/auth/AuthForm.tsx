import { auth } from '@/FirebaseConfig';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import { STATUS } from '@/src/constants/enums';
import { AuthDataInterface, AuthFormsPropsInterface } from '@/src/constants/interfaces';
import { setCalendar } from '@/src/redux/calendar/calendarReducer';
import { setChat } from '@/src/redux/chat/chatReducer';
import { setLoadingFalse, setLoadingTrue } from '@/src/redux/loadingReducer';
import { RootState } from '@/src/redux/store';
import { setTask, setTaskDone, setTaskInProgress } from '@/src/redux/task/taskReducer';
import { setUser } from '@/src/redux/user/userReducer';
import { getData, getItems, getUsers, saveToken, transformTasksForCalendar } from '@/src/utils/functions';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
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
  const signIn = async (data: AuthDataInterface) => {
    try{
      setAuthData(data);
      dispatch(setLoadingTrue());
      const { email, password } = data;
      const user = await signInWithEmailAndPassword(auth , email, password)
      if (user) {
        await saveToken(user?.user?.accessToken)
        
        if (!user.user) return null;
        const uid = user.user.uid;
        const userSnap = await getUsers({id: uid})
        const messages = await getItems({
          collectionName: "chat",
          filters: [{
            field: "userId",
            operator: '==',
            value: uid,
          }]
        })
        const task = await getItems({
          collectionName: "tasks",
          filters: [{
            field: "userId",
            operator: '==',
            value: uid,
          }]
        })         
        if (userSnap.exists()) {
          dispatch(setUser(userSnap.data()))
          messages?.docs.map(doc => dispatch(setChat(doc.data())))
          task?.docs.map(doc => {            
              switch(doc.data().status){
                  case STATUS.TODO : 
                    dispatch(setTask(doc.data()));
                    break;
                  case STATUS.InProgress : 
                    dispatch(setTaskInProgress(doc.data())); 
                    break;
                  case STATUS.DONE : 
                    dispatch(setTaskDone(doc.data()));
                    break;
                  default: console.warn("Unknown status:", doc.data().status);
              } 
              
            }
          )
          const taskDocs = task?.docs.map(doc => doc.data());
          if(taskDocs){
            const calendarReadyData = transformTasksForCalendar(taskDocs);            
            dispatch(setCalendar(calendarReadyData));
          }     
        } else {
          console.log("No such user document!");
          return null;
        }
        router.replace("/(tabs)/welcom")        
      }
    }catch(error: any){
      console.error("Error signing in:", error);
      Alert.alert(t("signInAlert"), error.message)
    }finally{
      dispatch(setLoadingFalse());
    }
  }  
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
          onPress={handleSubmit((data: AuthDataInterface) => signIn(data))}
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
