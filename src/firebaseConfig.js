import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDjpmyBaRn6cHS4ThlwEOfPlRRMjBFOsGM",
  authDomain: "fever-scan.firebaseapp.com",
  databaseURL: "https://fever-scan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fever-scan",
  storageBucket: "fever-scan.appspot.com",
  messagingSenderId: "1006960907867",
  appId: "1:1006960907867:web:85fa8d2a70980e0833117e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app); // Initialize Firestore

// Google Sign-in Function
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Reference to user document in Firestore
    const userRef = doc(db, "users", user.uid);

    // Check if user document exists
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // If user document does not exist, create one
      const userData = {
        uid: user.uid,
        name: user.displayName || "No Name",
        email: user.email || "No Email",
        imageUrl: user.photoURL || "",
        contactNumber: "N/A", // Default placeholder for contact number
        createdAt: new Date(),
      };

      // Store user data in Firestore
      await setDoc(userRef, userData);
      console.log("New user document created in Firestore:", userData);
      return userData;
    } else {
      // If user document exists, return the existing data
      console.log("User data fetched from Firestore:", userDoc.data());
      return userDoc.data();
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Error signing in with Google");
  }
};

// Fetch User Data Function
export const fetchUserData = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);

    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User data not found in Firestore");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export { database, firestore }; // Export database and firestore
