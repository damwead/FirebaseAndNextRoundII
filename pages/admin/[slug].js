import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import ImageUploader from '../../components/ImageUploader';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}


function PostManager() {
  const [preview, setPreview] = useState(false); // ability to preview/edit

  const router = useRouter(); // grab slug from url 
  const { slug } = router.query; // slug = doc id
  
  // absolute path to the document using doc()
  const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug)
  const [post] = useDocumentDataOnce(postRef); // for listening in real time - useDocumentData()

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
  
   // formState gives info about curr state of the form
  const { isValid, isDirty } = formState; 

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          // name="content"
          // ref={register({
          //   maxLength: { value: 20000, message: 'content is too long' },
          //   minLength: { value: 10, message: 'content is too short' },
          //   required: { value: true, message: 'content is required' },
          // })}

          {...register("content", {
            maxLength: {value: 2000, message: 'content is too long'},
            minLength: {value: 10, message: 'content is too long'},
            required: 'content is required'
          })}
        ></textarea>

        {/* {errors.content && <p className="text-danger">{errors.content.message}</p>} */}

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" {...register("published")} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/admin');
      toast('post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}