import express = require('express');
import admin = require('firebase-admin');
import { ErrorResponse } from '../../constants/errors';
import { Belong } from '../../domain/belong';
import { COLLECTION_NAMES } from '../../infra/endPoints';

type PutBelongReqBody = Belong;

export const postBelong = async (
  req: express.Request<void, void, PutBelongReqBody>,
  res: express.Response<void | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);

  const db = admin.firestore();
  const { body } = req;

  try {
    const participationRef = db.collection(COLLECTION_NAMES.belong);
    await participationRef.add({
      userId: body.userId,
      orchestraId: body.orchestraId,
    });

    return res.status(200);
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
