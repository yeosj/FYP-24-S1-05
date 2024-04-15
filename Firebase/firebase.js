import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh3tSaWVLkQnuOZKZTotzbm1PMVimiQxc",
  authDomain: "login-app-13fff.firebaseapp.com",
  projectId: "login-app-13fff",
  storageBucket: "login-app-13fff.appspot.com",
  messagingSenderId: "559655406635",
  appId: "1:559655406635:web:ae5d15ca338da233f1ee6e",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
