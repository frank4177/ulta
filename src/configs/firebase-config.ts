import { initializeApp } from 'firebase/app';
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    //...
    apiKey: "AIzaSyD6G8CVHeuw601Zp3MgbuBBUFRf8RC_Q-Q",
    authDomain: "twitter-auth-b7daf.firebaseapp.com",
    projectId: "twitter-auth-b7daf",
    storageBucket: "twitter-auth-b7daf.appspot.com",
    messagingSenderId: "68120252259",
    appId: "1:68120252259:web:cc85bb076e45177e680d56",
    measurementId: "G-P8E2T20T6X"
  };
  
  const app = initializeApp(firebaseConfig);

  export const authentication = getAuth(app)
