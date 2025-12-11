// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcc_nk6-Jgjz4qkFEqI2Ju4q5gDc_VK2E",
  authDomain: "your-daily-compass.firebaseapp.com",
  projectId: "your-daily-compass",
  storageBucket: "your-daily-compass.firebasestorage.app",
  messagingSenderId: "683586923011",
  appId: "1:683586923011:web:463badb8701c772ded3c36",
  measurementId: "G-LC4PFLF6F3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app); // <-- voilà ton "db"
