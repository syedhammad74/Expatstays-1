
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCF9DpX3KpX2FoufUekmarrTfl2WyGnP9s",
  authDomain: "expat-stays.firebaseapp.com",
  databaseURL:
    "https://expat-stays-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expat-stays",
  storageBucket: "expat-stays.firebasestorage.app",
  messagingSenderId: "678360723457",
  appId: "1:678360723457:web:53df526e763542f8761000",
  measurementId: "G-1X96ZEMR8Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database };
