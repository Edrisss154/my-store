import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1QV-pW76_buJHfQLYx_u4ZuMM_xSqMoQ",
    authDomain: "accountjoo.firebaseapp.com",
    projectId: "accountjoo",
    storageBucket: "accountjoo.firebasestorage.app",
    messagingSenderId: "372903677140",
    appId: "1:372903677140:web:3b05563b2ac29c338e7f41",
    measurementId: "G-S5G431M9LV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };




