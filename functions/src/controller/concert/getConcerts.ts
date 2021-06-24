import express = require('express');
import admin = require('firebase-admin');
import { Concert } from '../../domain/concert';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse } from '../errors';

interface GetConcertReqBody {
  prefecture?: string;
}

interface GetConcert {
  id: Concert['id'];
  title: Concert['title'];
  location: Concert['location'];
  date: Concert['date'];
  symphonies: Concert['symphonies'];
  orchestra: {
    id: Orchestra['id'];
    name: Orchestra['name'];
  };
}

export const getConcerts = async (
  req: express.Request<
    void,
    Record<'concerts', GetConcert[]>,
    GetConcertReqBody
  >,
  res: express.Response<Record<'concerts', GetConcert[]> | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();

  try {
    const querySnapshot =
      req.body.prefecture === undefined
        ? await db.collection(COLLECTION_NAMES.concert).get()
        : await db
            .collection(COLLECTION_NAMES.concert)
            .where('prefecture', '==', true)
            .get();
    const concerts = querySnapshot.docs.map(
      (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
        const data = doc.data();
        const concert: GetConcert = {
          id: doc.id,
          title: data.title,
          location: data.location,
          date: data.date.toDate(),
          symphonies: data.symphonies,
          orchestra: data.orchestra,
        };

        return concert;
      },
    );

    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).send({ concerts });
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
