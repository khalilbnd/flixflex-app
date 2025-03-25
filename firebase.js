// firebase.js
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD2s7H81K7lVx_AxzMHt0x_OLv4erYwFjs",
    authDomain: "flixflex-app.firebaseapp.com",
    projectId: "flixflex-app",
    storageBucket: "flixflex-app.firebasestorage.app",
    messagingSenderId: "388742211778",
    appId: "1:388742211778:web:f9cd4e481f194762e9f35b",
    measurementId: "G-LL3RDQQ2ST"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { auth, firestore };