import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyABCl-Y-Ia-yWfE8LKZmLWu592BO2LPklk",
  authDomain: "my-menu-59199.firebaseapp.com",
  projectId: "my-menu-59199",
  storageBucket: "my-menu-59199.appspot.com",
  messagingSenderId: "447894307168",
  appId: "1:447894307168:web:60d174d7b2c11888795e05",
  measurementId: "G-YHCZML5QMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const projectFirestore = getFirestore(app)

export {projectFirestore};