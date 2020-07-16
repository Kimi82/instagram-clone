import firebase from "firebase";

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyBBlJvI3m-cSzwaY9e3VPMhptCrq98EiNM",
    authDomain: "instagram-clone-44184.firebaseapp.com",
    databaseURL: "https://instagram-clone-44184.firebaseio.com",
    projectId: "instagram-clone-44184",
    storageBucket: "instagram-clone-44184.appspot.com",
    messagingSenderId: "835827753088",
    appId: "1:835827753088:web:71297b6edafa22f56e0665",
    measurementId: "G-BS7ZN92C4X"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
