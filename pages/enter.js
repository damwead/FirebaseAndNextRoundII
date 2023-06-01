import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';

import { UserContext } from '../lib/context';
import { useContext } from 'react';

export default function EnterPage({ }) {
  const { user, username} = useContext(UserContext);

  // 3 states:
  // user signed out
  // user signed in n doesnt have a username
  // user signed in 
  return (
    <main>
      {user ?
        !username ? <UserNameForm /> : <SignOutButton />
        : <SignInButton />
      }
    </main>
  )
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} width="30px" /> Sign in with Google
    </button>
    );
 } 

 function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

 function UserNameForm() {

 }