import admin = require('firebase-admin');

export const onUserSignUp = (user: admin.auth.UserRecord) => {
  const { email, displayName, photoURL, uid } = user;
  const db = admin.firestore();
  const userRef = db.collection('user');
  const newPhotoURL =
    photoURL ??
    'https://firebasestorage.googleapis.com/v0/b/symphony-forum.appspot.com/o/%E2%99%AA.png?alt=media&token=8c1a9f64-f0a4-497e-bd70-9da150518b0d';

  userRef.doc(uid).set({ email, displayName, photoURL: newPhotoURL, uid });
};
