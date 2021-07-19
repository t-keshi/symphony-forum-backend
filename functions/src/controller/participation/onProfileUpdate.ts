import functions = require('firebase-functions');
import admin = require('firebase-admin');

interface UserDocument {
  photoURL: string;
}

export const onProfileUpdate = async (
  user: functions.Change<functions.firestore.QueryDocumentSnapshot>,
) => {
  const db = admin.firestore();
  const prevUserDocument = user.before.data() as UserDocument;
  const prevPhotoURL = prevUserDocument.photoURL;
  const newUserDocument = user.after.data() as UserDocument;
  const newPhotoURL = newUserDocument.photoURL;

  if (prevPhotoURL !== newPhotoURL) {
    const querySnapshotOfPrevOrchestraName = await db
      .collection('participation')
      .where('userSnippets.uid', '==', user.before.id)
      .get();

    querySnapshotOfPrevOrchestraName.docs.map(
      (
        doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
      ) => {
        db.collection('participation')
          .doc(doc.id)
          .update({ userSnippets: { photoURL: newPhotoURL } });
      },
    );
  }
};
