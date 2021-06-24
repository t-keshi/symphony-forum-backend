import express = require('express');
import admin = require('firebase-admin');
import firebase from 'firebase/app';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse } from '../errors';

interface PostConcertReq {
  title: string;
  date: Date;
  location: string;
  placeId: string;
  symphonies: string[];
  openAt: Date;
  startAt: Date;
  closeAt: Date;
  orchestra: {
    id: Orchestra['id'];
    name: Orchestra['name'];
  };
}

export const postConcert = async (
  req: express.Request<void, void, PostConcertReq>,
  res: express.Response<void | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();
  const { body } = req;

  try {
    const concertRef = db.collection(COLLECTION_NAMES.concert);
    await concertRef.add({
      title: body.title,
      date: firebase.firestore.Timestamp.fromDate(body.date),
      location: body.location,
      placeId: body.placeId,
      symphonies: body.symphonies,
      orchestra: body.orchestra,
      programs: '',
      openAt: '',
      startAt: '',
      closeAt: '',
    });

    return res.status(200);
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
