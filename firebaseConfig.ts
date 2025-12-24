
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClBUnyEvOyW45Tkb4jUJPr82ANHCL2_Wc",
    authDomain: "food-delivery-1827f.firebaseapp.com",
    projectId: "food-delivery-1827f",
    storageBucket: "food-delivery-1827f.firebasestorage.app",
    messagingSenderId: "659249963888",
    appId: "1:659249963888:web:a5efce7ffcef65e7b925b5",
    measurementId: "G-TT8YX34H37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore and export them
export const auth = getAuth(app);
export const db = getFirestore(app);

