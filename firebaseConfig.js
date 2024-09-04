import {initializeApp} from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDfXgV0iHKqPFfYZNYUxYrsLMBuoOkdKII",
    authDomain: "imdb-a4815.firebaseapp.com",
    projectId: "imdb-a4815",
    storageBucket: "imdb-a4815.appspot.com",
    messagingSenderId: "982560757888",
    appId: "1:982560757888:web:52890d06d62b2ab75d2e65",
    measurementId: "G-B83WK6J7ZP"
};
  
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app)

export { storage };
