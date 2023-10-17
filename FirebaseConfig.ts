import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBA1LpIZ8HJPuy9PT5WfNunCr9vnAzCEw",
  authDomain: "pecunia-aadc8.firebaseapp.com",
  projectId: "pecunia-aadc8",
  storageBucket: "pecunia-aadc8.appspot.com",
  messagingSenderId: "1091579973072",
  appId: "1:1091579973072:web:d883c4d0be7c06e548fdd5"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORE = getFirestore(FIREBASE_APP);