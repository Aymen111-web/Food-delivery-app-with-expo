

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

