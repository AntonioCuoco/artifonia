// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth,initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "artifonia-31f28.firebaseapp.com",
  projectId: "artifonia-31f28",
  storageBucket: "artifonia-31f28.firebasestorage.app",
  messagingSenderId: "823296249234",
  appId: "1:823296249234:web:372afb4978f1fd0fc8454b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const googleAuthProvider = new GoogleAuthProvider();

export { auth, app };