import functions = require('firebase-functions');
import admin = require('firebase-admin');

interface UserDocument {
  photoURL: string;
  displayName: string;
  part: string;
}

export const onUserUpdate = async (
  user: functions.Change<functions.firestore.QueryDocumentSnapshot>,
) => {
  const db = admin.firestore();
  const prevUserDocument = user.before.data() as UserDocument;
  const newUserDocument = user.after.data() as UserDocument;
  const shouldUpdateParticipation =
    prevUserDocument.photoURL !== newUserDocument.photoURL;

  if (shouldUpdateParticipation) {
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
          .update({ userSnippets: { photoURL: newUserDocument.photoURL } });
      },
    );
  }

  const shouldUpdateBelong =
    prevUserDocument.photoURL !== newUserDocument.photoURL ||
    prevUserDocument.displayName !== newUserDocument.displayName ||
    prevUserDocument.part !== newUserDocument.part;

  if (shouldUpdateBelong) {
    const querySnapshotOfPrevOrchestraName = await db
      .collection('belong')
      .where('userSnippets.uid', '==', user.before.id)
      .get();

    querySnapshotOfPrevOrchestraName.docs.map(
      (
        doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
      ) => {
        db.collection('belong')
          .doc(doc.id)
          .update({
            userSnippets: {
              photoURL: newUserDocument.photoURL,
              part: newUserDocument.part,
              displayName: newUserDocument.displayName,
            },
          });
      },
    );
  }
};
