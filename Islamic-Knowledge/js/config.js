/* ==================================
   ISLAMIC KNOWLEDGE
   FIREBASE CONFIGURATION
================================== */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWRakwlsht7t_5gEB3VZjbAP7psbARqag",
    authDomain: "islamic-knowledge-ae0de.firebaseapp.com",
    projectId: "islamic-knowledge-ae0de",
    storageBucket: "islamic-knowledge-ae0de.firebasestorage.app",
    messagingSenderId: "33541022903",
    appId: "1:33541022903:web:4cb79b058ef30e75865932"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase services
export { app, db, auth };