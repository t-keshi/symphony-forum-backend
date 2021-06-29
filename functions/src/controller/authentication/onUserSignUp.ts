import admin = require('firebase-admin');

export const onUserSignUp = (user: admin.auth.UserRecord) => {
  const { email, displayName, photoURL, uid } = user;
  const db = admin.firestore();
  const userRef = db.collection('user');

  userRef.doc(uid).set({ email, displayName, photoURL, uid });
};
