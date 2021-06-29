import express = require('express');
import admin = require('firebase-admin');
import { ErrorResponse, ERRORS } from '../../constants/errors';
import { Concert } from '../../domain/concert';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { OmitId } from '../../utility';

interface PutConcertParams {
  id: string;
}
type PutConcertReqBody = OmitId<Concert>;

export const putConcert = async (
  req: express.Request<PutConcertParams, void, PutConcertReqBody>,
  res: express.Response<void | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();
  const { body } = req;

  try {
    const concertRef = db
      .collection(COLLECTION_NAMES.concert)
      .doc(req.params.id);
    await concertRef.update({
      title: body.title,
      location: body.location,
      date: body.date,
      openAt: body.openAt,
      startAt: body.startAt,
      closeAt: body.closeAt,
    });

    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200);
  } catch (error) {
    console.error(error, req, res);
    res.set('Access-Control-Allow-Origin', '*');
    return res.status(400).send({ error: ERRORS.ConcertNotFound });
  }
};
