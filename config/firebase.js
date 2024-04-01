// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbmzFXBTKtR8OyVSya5locT3IZMzN-Pp0",
  authDomain: "movie-app-16d26.firebaseapp.com",
  projectId: "movie-app-16d26",
  storageBucket: "movie-app-16d26.appspot.com",
  messagingSenderId: "912633989670",
  appId: "1:912633989670:web:33af0c63996b21c27bb4e7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const auth = getAuth(app);

export {auth, firestore};

//Android: 226134222281-pq004tchbm42dfemuct29bduupu9r9i4.apps.googleusercontent.com