import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false); // wether if's uploading
  const [progress, setProgress] = useState(0); // progress of uploading
  const [downloadURL, setDownloadURL] = useState(null); // wether we got a url

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    // upload directory/userID
    // Date.now() - makes the name of file unique 
    const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file)

    // Listen to updates to upload task
    // snapshot contains meta data, including transferred bytes
    // with progress state it would be updated in UI
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef)) // get url from orig ref
      .then((url) => { // thats a promise, we can chain .then again and update state
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {/* if uploading show progress */}
      {uploading && <h3>{progress}%</h3>}

      {!uploading && ( // if not uploading show btn
        <>
          <label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}
      {/* if theres download url we gona show it as a code snipet */}
      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}