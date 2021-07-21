import functions = require('firebase-functions');
import admin = require('firebase-admin');

interface OrchestraDocument {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  conductor?: string;
  subConductor?: string;
  homePage: string | null;
}

export const onOrchestraUpdate = async (
  orchestra: functions.Change<functions.firestore.QueryDocumentSnapshot>,
) => {
  const db = admin.firestore();

  const prevOrchestraDocument = orchestra.before.data() as OrchestraDocument;
  const prevOrchestraName = prevOrchestraDocument.name;
  const newOrchestraDocument = orchestra.after.data() as OrchestraDocument;
  const newOrchestraName = newOrchestraDocument.name;

  if (prevOrchestraName !== newOrchestraName) {
    const querySnapshotOfPrevOrchestraName = await db
      .collection('concert')
      .where('orchestra.name', '==', prevOrchestraName)
      .get();

    querySnapshotOfPrevOrchestraName.docs.map(
      (
        doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
      ) => {
        db.collection('concert')
          .doc(doc.id)
          .update({ orchestra: { name: newOrchestraName } });
      },
    );
  }
};
