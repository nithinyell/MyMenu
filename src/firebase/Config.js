import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAiPVl5d-QFfwQFRIKBcSic9NN6IVxqBis",
  authDomain: "my-menu-74e62.firebaseapp.com",
  projectId: "my-menu-74e62",
  storageBucket: "my-menu-74e62.appspot.com",
  messagingSenderId: "499983731152",
  appId: "1:499983731152:web:b5c529cc58aea96e0fd1d5",
  measurementId: "G-PSNPJZQL83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const projectFirestore = getFirestore(app)

export {projectFirestore};
