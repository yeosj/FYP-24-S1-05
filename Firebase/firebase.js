import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAh3tSaWVLkQnuOZKZTotzbm1PMVimiQxc",
  authDomain: "login-app-13fff.firebaseapp.com",
  projectId: "login-app-13fff",
  storageBucket: "login-app-13fff.appspot.com",
  messagingSenderId: "559655406635",
  appId: "1:559655406635:web:ae5d15ca338da233f1ee6e",
};

let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app(); // if already initialized, use that one
}

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = firebase.firestore();

export { firebase, auth, db };
