// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPYGa164UKbtpPG0EsK89mmYy-fAn1dCM",
  authDomain: "boviface-db402.firebaseapp.com",
  projectId: "boviface-db402",
  storageBucket: "boviface-db402.firebasestorage.app",
  messagingSenderId: "689690212188",
  appId: "1:689690212188:web:c25f8faffeb2e6890bf399",
  measurementId: "G-YVL1PWX0VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);