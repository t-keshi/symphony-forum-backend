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
}

export const onOrchestraCreate = async (
  orchestra: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const db = admin.firestore();
  const newOrchestraDocument = orchestra.data() as OrchestraDocument;
  const managementUserId = newOrchestraDocument.managementUserId;
  const documentSnapshotOfManagementUser = db
    .collection('user')
    .doc(managementUserId);
  await documentSnapshotOfManagementUser.update({
    managementOrchestraId: context.params.orchestraId,
  });
};
