import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBD-WBTfczBEhC3QnwoOBk7N40FRogdZjw",
  authDomain: "tbiweb-65e36.firebaseapp.com",
  projectId: "tbiweb-65e36",
  storageBucket: "tbiweb-65e36.appspot.com",
  messagingSenderId: "869589235364",
  appId: "1:869589235364:web:192444089bd8274f459831"
};


const app = initializeApp(firebaseConfig);
export const firestore=getFirestore(app);
export const storage=getStorage(app);