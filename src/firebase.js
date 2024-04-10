// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA_zG1w4q5vN453iR_bZs5OYO2z0u96f8",
  authDomain: "skin-ui-app.firebaseapp.com",
  databaseURL: "https://skin-ui-app-default-rtdb.firebaseio.com",
  projectId: "skin-ui-app",
  storageBucket: "skin-ui-app.appspot.com",
  messagingSenderId: "857374977406",
  appId: "1:857374977406:web:fa47e7dab8ea94c4ae972f",
  measurementId: "G-ZYPV1WR7F5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
const database = getDatabase(app);
export { database };
const auth = getAuth(app);