// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgCxVxevyaTOFHDphs0inwmT_U1DE7fu0",
  authDomain: "netflix-clone-37536.firebaseapp.com",
  projectId: "netflix-clone-37536",
  storageBucket: "netflix-clone-37536.appspot.com",
  messagingSenderId: "903049367341",
  appId: "1:903049367341:web:9340d1554faf7513c08da4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
