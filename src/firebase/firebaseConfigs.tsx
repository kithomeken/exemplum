import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

export const firebaseConfig = {
    apiKey: "AIzaSyDLFPNVR0g0gEkPpVsrh3pDbVGAhmzeaVo",
    authDomain: "tip-me-heic240119.firebaseapp.com",
    projectId: "tip-me-heic240119",
    storageBucket: "tip-me-heic240119.appspot.com",
    messagingSenderId: "515264196533",
    appId: "1:515264196533:web:7ce4117e55dabba611f3fc",
    measurementId: "G-EHGJZMG0LZ"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp)