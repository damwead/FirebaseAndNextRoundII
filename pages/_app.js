import '../styles/globals.css';
import Navbar from "../components/Navbar";
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

function MyApp({ Component, pageProps }) {
  // const [user] = useAuthState(auth);


  return (
    <UserContext.Provider value={{ user:{}, username:'Ken' }} >
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp
