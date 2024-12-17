// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDjpmyBaRn6cHS4ThlwEOfPlRRMjBFOsGM",
  authDomain: "fever-scan.firebaseapp.com",
  databaseURL: "https://fever-scan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fever-scan",
  storageBucket: "fever-scan.firebasestorage.app",
  messagingSenderId: "1006960907867",
  appId: "1:1006960907867:web:85fa8d2a70980e0833117e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
