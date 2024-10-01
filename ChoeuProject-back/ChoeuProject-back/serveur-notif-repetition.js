// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


//config selon chat :
const firebase = require('firebase/app');
require('firebase/messaging');

const firebaseConfig = {
    apiKey: "AIzaSyDHROulD1ZlWRJdKiNvb959_WZby3VS9kw",
    authDomain: "gestion-de-choeur.firebaseapp.com",
    projectId: "gestion-de-choeur",
    storageBucket: "gestion-de-choeur.appspot.com",
    messagingSenderId: "992599904038",
    appId: "1:992599904038:web:51f3e1852ea09d5c6c3be7",
    measurementId: "G-F6FP4G2EGN"
  };

// Initialiser Firebase avec votre configuration
firebase.initializeApp(firebaseConfig);

// Si vous avez besoin de Firebase Cloud Messaging (FCM)
const messaging = firebase.messaging();
