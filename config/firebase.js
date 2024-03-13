// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs0zYHkQaqxeu37e_YBVPd9z_3Pzs3m-Q",
  authDomain: "movie-app-13b8b.firebaseapp.com",
  projectId: "movie-app-13b8b",
  storageBucket: "movie-app-13b8b.appspot.com",
  messagingSenderId: "665082916800",
  appId: "1:665082916800:web:2768b9f70a68125ddfe225",
  measurementId: "G-7H2K4ENF1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);