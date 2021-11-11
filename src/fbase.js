import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtieAYOprTr4oLEMKNd2WqMqp0eBBobp0",
  authDomain: "twitter-clone-bd495.firebaseapp.com",
  projectId: "twitter-clone-bd495",
  storageBucket: "twitter-clone-bd495.appspot.com",
  messagingSenderId: "390186404678",
  appId: "1:390186404678:web:7703537303bfa1f28b3347"
};

firebase.initializeApp(firebaseConfig);

export const authService = getAuth();