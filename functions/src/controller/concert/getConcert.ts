import express = require('express');
import admin = require('firebase-admin');
import { Concert } from '../../domain/concert';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse, ERRORS } from '../errors';

interface GetConcertParams {
  id: string;
}

interface GetConcert extends Concert {
  orchestra: {
    id: Orchestra['id'];
    name: Orchestra['name'];
  };
}

export const getConcert = async (
  req: express.Request<GetConcertParams, GetConcert>,
  res: express.Response<GetConcert | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();

  try {
    const documentSnapshot = await db
      .collection(COLLECTION_NAMES.concert)
      .doc(req.params.id)
      .get();
    const id = documentSnapshot.id;
    const data: FirebaseFirestore.DocumentData | undefined =
      documentSnapshot.data();

    if (data === undefined) {
      return res.status(400).send({ error: ERRORS.ConcertNotFound });
    }

    const concert: GetConcert = {
      id,
      title: data.title,
      programs: data.programs,
      location: data.location,
      date: data.date.toDate(),
      openAt: data.openAt.toDate(),
      startAt: data.startAt.toDate(),
      closeAt: data.closeAt.toDate(),
      participantsCount: data.participantsCount,
      orchestra: data.orchestra,
      symphonies: data.symphonies,
    };

    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).send(concert);
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
