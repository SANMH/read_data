import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

export const config = {
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

const auth = firebase.auth();
export const firebaseDatabase = firebase.database();

// export const storage = app.storage();
//export const functions = app.functions();

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

const user = uid => firebaseDatabase.ref(`users/${uid}`);

const users = () => firebaseDatabase.ref('users');


 //user = uid => firebaseDatabase.ref(`user/${uid}`);

 //users = () => firebaseDatabase.ref('user');


// doPasswordReset = email => this.auth.sendPasswordResetEmail( email );
//
// doPasswordUpdate = password =>
//   this.auth.currentUser.updatePassword( password );

export default firebase
