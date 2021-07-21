import admin = require('firebase-admin');
import { COLLECTION_NAMES } from '../../infra/endPoints';
import functions = require('firebase-functions');

interface ParticipationDocument {
  uid: string;
  concertSnippets: {
    id: string;
  };
  toggle: 'add' | 'remove';
}

export const onConcertCancel = async (
  participation: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const db = admin.firestore();
  const newConcertDocument = participation.data() as ParticipationDocument;

  try {
    const concertsRef = db.collection(COLLECTION_NAMES.concert);
    const concertRef = concertsRef.doc(newConcertDocument.concertSnippets.id);
    await concertRef.update({
      participants: admin.firestore.FieldValue.arrayRemove(
        context.params.participateId,
      ),
      participantsCount: admin.firestore.FieldValue.increment(-1),
    });
  } catch (error) {
    console.error(error, participation, context);
  }
};
