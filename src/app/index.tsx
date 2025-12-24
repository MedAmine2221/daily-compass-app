import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from '../utils/functions';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('userToken');
          if(storedToken){
            setToken(storedToken);
            signIn(dispatch, router, t, undefined, undefined, true)
          }
        } catch (error) {
          console.log('Erreur lors de la vérification du token :', error);
        } finally {
          setLoading(false);
        }
      };
      checkToken();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={token ? '/(tabs)/welcom' : '/auth'} />;
}
