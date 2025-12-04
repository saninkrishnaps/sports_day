// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase Config (paste yours here)
const firebaseConfig = {
    apiKey: "AIzaSyAbWtaNNUdCprsbQXTf2Wj90kInnSxLZb9c",
    authDomain: "sportsday-college.firebaseapp.com",
    projectId: "sportsday-college",
    storageBucket: "sportsday-college.firebasestorage.app",
    messagingSenderId: "252327587076",
    appId: "1:252327587076:web:b53096ce3390cd570cc6d1",
    measurementId: "G-ZHGHFTDZ14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
