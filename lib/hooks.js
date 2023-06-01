import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';


// lets u to listen to current user
// when user is signed in it will be populated with user-object
// when user singed out it will be null
export function useUserData() {
  const [user] = useAuthState(auth); // get user from firebase
  const [username, setUsername] = useState(null); // init state for username

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      // const ref = firestore.collection('users').doc(user.uid);
      const ref = doc(getFirestore(), 'users', user.uid); // ref to user
      unsubscribe = onSnapshot(ref, (doc) => { // returns a func that when called unsubscribes us
        setUsername(doc.data()?.username); // callback: returns latest data
      }); 
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}