import express = require('express');
import admin = require('firebase-admin');
import { ErrorResponse } from '../../constants/errors';
import { Prefecture } from '../../constants/prefectures';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';

interface GetConcertReqBody {
  prefecture?: string;
  orderBy?: string;
}

interface GetConcert {
  id: string;
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

export const getConcerts = async (
  req: express.Request<
    unknown,
    Record<'concerts', GetConcert[]>,
    unknown,
    GetConcertReqBody
  >,
  res: express.Response<Record<'concerts', GetConcert[]> | ErrorResponse>,
) => {
  const db = admin.firestore();

  try {
    const concertRef = db.collection(COLLECTION_NAMES.concert);
    const concertRefFiltered =
      req.query.prefecture === undefined
        ? concertRef
        : concertRef.where('prefecture', '==', req.query.prefecture);
    const concertRefOrdered =
      req.query.orderBy === undefined
        ? concertRefFiltered
        : concertRefFiltered.orderBy(req.query.orderBy, 'desc');
    const querySnapshot = await concertRefOrdered.get();
    const concerts = querySnapshot.docs.map(
      (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
        const data = doc.data();
        const concert: GetConcert = {
          id: doc.id,
          title: data.title,
          address: data.address,
          placeId: data.placeId,
          prefecture: data.prefecture,
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
    res.set('Access-Control-Allow-Origin', '*');
    return res.status(500);
  }
};
