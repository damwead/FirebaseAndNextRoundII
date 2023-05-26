import firebase from 'firebase/compat/app'

// import 'firebase/compat/auth';
// import 'firebase/compat/googleAuthProvider';
// import 'firebase/compat/firestore';
// import 'firebase/compat/storage';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBuVVezNuHzvEQNnrXHsTrMX8VzcDMoZVo",
  authDomain: "part2-746bc.firebaseapp.com",
  projectId: "part2-746bc",
  storageBucket: "part2-746bc.appspot.com",
  messagingSenderId: "1035908763096",
  appId: "1:1035908763096:web:887a6c144be56815d676ad"
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig)
// }

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// export const firestore = firebase.firestore();
export const firestore = getFirestore(firebaseApp);
// export const storage = firebase.storage();
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';