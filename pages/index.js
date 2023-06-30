import PostFeed from '../components/PostFeed';
import Metatags from '../components/Metatags';
import Loader from '../components/Loader';
import { firestore, postToJSON, getIt } from '../lib/firebase';
import { Timestamp, query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';

import { useState } from 'react';

// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
 
  return {
    props: { posts }, // will be passed to the page component as props
  };
}


export default function Home(props) {
  const [posts, setPosts] = useState(props.posts); // data can change, thus using useState
  const [loading, setLoading] = useState(false);
  
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    // we need firestore time stamp, in or der to upload more elements later

      const ref = collectionGroup(getFirestore(), 'posts');
      const postsQuery = query(
        ref,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(cursor),
        limit(LIMIT),
      ) // making query

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data()); // fetching data

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      {/* if not loading and not end of post, then show button */}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'} {/* if reached post end */}
    </main>
  );
}
