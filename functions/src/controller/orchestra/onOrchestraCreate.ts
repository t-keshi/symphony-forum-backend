import functions = require('firebase-functions');
import admin = require('firebase-admin');

interface OrchestraDocument {
  name: string;
  description: string;
  membersCount: number;
  conductor?: string;
  subConductor?: string;
  homePage: string | null;
  managementUserId: string;
  avatarUrl: string;
  coverUrl: string;
}

export const onOrchestraCreate = async (
  orchestra: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const db = admin.firestore();
  const newOrchestraDocument = orchestra.data() as OrchestraDocument;
  const managementUserId = newOrchestraDocument.managementUserId;

  // userUpdate
  const documentOfUser = db.collection('user').doc(managementUserId);
  await documentOfUser.update({
    managementOrchestraId: context.params.orchestraId,
  });

  // belongUpdate
  const collectionOfBelong = db.collection('belong');
  await collectionOfBelong.add({
    managementOrchestraId: context.params.orchestraId,
    orchestraSnippets: {
      id: context.params.orchestraId,
      name: newOrchestraDocument.name,
      description: newOrchestraDocument.description,
      avatarUrl: newOrchestraDocument.avatarUrl,
    },
    userSnippets: {
      uid: newOrchestraDocument.managementUserId,
    },
  });
};
