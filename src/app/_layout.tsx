import { Stack } from 'expo-router';
import React from 'react';
import { Provider } from "react-redux";
import "../global.css";
import { store } from '../redux/store';

export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/index" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password/index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password/index" options={{ headerShown: false }} />
      </Stack>
    </Provider>
);
}
