import express = require('express');
import admin = require('firebase-admin');
import { Participation } from '../../domain/participation';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse } from '../errors';

type PutParticipationReqBody = Participation;

export const postParticipation = async (
  req: express.Request<void, void, PutParticipationReqBody>,
  res: express.Response<void | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();
  const { body } = req;

  try {
    const participationRef = db.collection(COLLECTION_NAMES.participation);
    await participationRef.add({
      userId: body.userId,
      concertId: body.concertId,
    });

    return res.status(200);
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
