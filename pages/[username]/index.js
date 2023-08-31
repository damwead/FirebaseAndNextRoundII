import PostFeed from '../../components/PostFeed';
import UserProfile from '../../components/UserProfile';
import { query, collection, where, getDocs, limit, orderBy, getFirestore } from 'firebase/firestore';

import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { notFound } from 'next/navigation';


export async function getServerSideProps({ query: urlQuery }) {
  // server side rendering, next will run it on server
  // every time page is requested
  // it send back the props(usr and pic) to component
  const { username } = urlQuery;; // we'll get it from url

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // We need to retrive user posts
  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'), // descend order
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON); // need to be serializable to JSON
  }

  return {
    props: { user, posts } // will be passed o the page component as a props
  };
}


export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user}/>
      <PostFeed posts={posts}/>
    </main>
  )
}