import firebase from 'firebase/app';
import 'firebase/database';

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    apiKey: "AIzaSyDdd_U4YOvwhZPb1giqpNKIk7hQ6PtFz94",
    authDomain: "kt-team-todo-list.firebaseapp.com",
    databaseURL: "https://kt-team-todo-list.firebaseio.com",
    storageBucket: "",
    projectId: 'kt-team-todo-list'
  }).database();
