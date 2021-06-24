import express = require('express');
import admin = require('firebase-admin');
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse } from '../errors';

interface OrchestraRes {
  id: string;
  name: string;
  description: string;
}

export const getOrchestras = async (
  req: express.Request,
  res: express.Response<Record<'orchestras', OrchestraRes[]> | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();

  try {
    const querySnapshot = await db.collection(COLLECTION_NAMES.orchestra).get();
    const orchestras = querySnapshot.docs.map(
      (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
        const data = doc.data();
        const orchestra: OrchestraRes = {
          id: doc.id,
          name: data.name,
          description: data.description,
        };

        return orchestra;
      },
    );

    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).send({ orchestras });
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
