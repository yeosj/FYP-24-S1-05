import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeJ9Kw2eMfrSwxuBpuQUoZNDfqGbVgkkk",
  authDomain: "suricata-log.firebaseapp.com",
  projectId: "suricata-log",
  storageBucket: "suricata-log.appspot.com",
  messagingSenderId: "953303859378",
  appId: "1:953303859378:web:206a19b44c5697fdaf09ab",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
