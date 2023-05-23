import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

import Loader from '../components/Loader';

import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success('hello toast', 
        {position: "top-right", icon: '👏', style: {
          borderRadius: '10px', 
          background: '#333',
          color: '#fff'
          }
        }
      )}>
        Toast me!
        </button>
    </div>
  );
}
