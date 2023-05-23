import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBuVVezNuHzvEQNnrXHsTrMX8VzcDMoZVo",
  authDomain: "part2-746bc.firebaseapp.com",
  projectId: "part2-746bc",
  storageBucket: "part2-746bc.appspot.com",
  messagingSenderId: "1035908763096",
  appId: "1:1035908763096:web:887a6c144be56815d676ad"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();