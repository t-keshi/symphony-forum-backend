import express = require('express');
import admin = require('firebase-admin');
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse, ERRORS } from '../errors';

interface GetConcertParams {
  id: string;
}

interface GetConcertReqBody {
  prefecture?: string;
}

export const getOrchestra = async (
  req: express.Request<GetConcertParams, Orchestra, GetConcertReqBody>,
  res: express.Response<Orchestra | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  const db = admin.firestore();

  try {
    const documentSnapshot = await db
      .collection(COLLECTION_NAMES.orchestra)
      .doc(req.params.id)
      .get();
    const id = documentSnapshot.id;
    const data: FirebaseFirestore.DocumentData | undefined =
      documentSnapshot.data();

    if (data === undefined) {
      return res.status(400).send({ error: ERRORS.ConcertNotFound });
    }

    const concert: Orchestra = {
      id,
      name: data.name,
      description: data.description,
      membersCount: data.membersCount,
      conductor: data.conductor,
      subConductor: data.subConductor,
      homePage: data.homePage,
    };

    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).send(concert);
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
