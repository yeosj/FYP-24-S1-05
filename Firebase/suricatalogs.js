import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import firebase from "firebase/app";
// import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4UjiSgQSpBw-IuLJnbLobvg0b7StId8k",
  authDomain: "suricata-bb16d.firebaseapp.com",
  databaseURL:
    "https://suricata-bb16d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "suricata-bb16d",
  storageBucket: "suricata-bb16d.appspot.com",
  messagingSenderId: "845897603498",
  appId: "1:845897603498:web:e1f27f76ebfb6c49faf3d3",
  measurementId: "G-Z0TG6R55Z8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
