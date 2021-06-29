import express = require('express');
import { ErrorResponse, ERRORS } from '../../constants/errors';
import { Prefecture } from '../../constants/prefectures';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import admin = require('firebase-admin');

interface PostConcertReq {
  title: string;
  date: Date;
  address: string;
  placeId: string;
  prefecture: Prefecture | null;
  symphonies: string[];
  orchestra: {
    id: Orchestra['id'];
    name: Orchestra['name'];
  };
}

export const postConcert = async (
  req: express.Request<void, void, PostConcertReq>,
  res: express.Response<void | string | ErrorResponse>,
) => {
  const db = admin.firestore();
  const { body } = req;

  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Max-Age', '3600');

    const concertRef = db.collection(COLLECTION_NAMES.concert);
    await concertRef.add({
      title: body.title,
      date: admin.firestore.Timestamp.fromDate(new Date(body.date)),
      address: body.address,
      placeId: body.placeId,
      prefecture: body.prefecture,
      symphonies: body.symphonies,
      orchestra: body.orchestra,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).send('success');
  } catch (error) {
    return res.status(400).send({ error: ERRORS.ConcertNotFound });
  }
};
