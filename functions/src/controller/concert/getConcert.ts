import express = require('express');
import admin = require('firebase-admin');
import { ErrorResponse, ERRORS } from '../../constants/errors';
import { Prefecture } from '../../constants/prefectures';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';

interface GetConcertParams {
  id: string;
}

interface GetConcert {
  id: string;
  title: string;
  date: Date;
  address: string;
  placeId: string;
  prefecture: Prefecture | null;
  symphonies: string[];
  programs: string;
  openAt: Date;
  startAt: Date;
  closeAt: Date;
  orchestra: {
    id: Orchestra['id'];
    name: Orchestra['name'];
  };
}

export const getConcert = async (
  req: express.Request<GetConcertParams, GetConcert>,
  res: express.Response<GetConcert | ErrorResponse>,
) => {
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
      address: data.address,
      placeId: data.placeId,
      prefecture: data.prefecture,
      date: data.date.toDate(),
      symphonies: data.symphonies,
      programs: data.programs,
      openAt: data.openAt.toDate(),
      startAt: data.startAt.toDate(),
      closeAt: data.closeAt.toDate(),
      orchestra: data.orchestra,
    };

    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).send(concert);
  } catch (error) {
    console.error(error, req, res);
    res.set('Access-Control-Allow-Origin', '*');
    return res.status(500);
  }
};
