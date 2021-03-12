import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/functions';
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCD7q2HPpizK4ETY07AU18HAS9ruHQ5wow",
  authDomain: "biciruta-275311.firebaseapp.com",
  databaseURL: "https://biciruta-275311.firebaseio.com",
  projectId: "biciruta-275311",
  storageBucket: "biciruta-275311.appspot.com",
  messagingSenderId: "456931040545",
  appId: "1:456931040545:web:b785b4343a86747bfbb260",
  measurementId: "G-9S0MHD5MVC"
};


firebase.initializeApp(config);

export default app;
const auth = app.auth();
const db = app.database();


// export const storage = app.storage();
// export const functions = app.functions();

// *** Auth API ***

// doCreateUserWithEmailAndPassword = ( email, password ) =>
//   this.auth.createUserWithEmailAndPassword( email, password );




export const listenAuthState = ( observer ) => {
  return auth.onAuthStateChanged( observer );
};

export const doSignInWithEmailAndPassword = ( email, password ) => {
  return auth.signInWithEmailAndPassword( email, password );
};

export const doLogout = () => auth.signOut();





// ***  User API ***

 const user = uid => db.ref(`users/${uid}`);
//
 const users = () => db.ref('users');

// doPasswordReset = email => this.auth.sendPasswordResetEmail( email );
//
// doPasswordUpdate = password =>
//   this.auth.currentUser.updatePassword( password );
