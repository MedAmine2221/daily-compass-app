import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('userToken');
          setToken(storedToken);
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
