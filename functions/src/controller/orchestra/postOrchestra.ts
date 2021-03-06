import express = require('express');
import admin = require('firebase-admin');
import { ErrorResponse } from '../../constants/errors';
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';

interface PostOrchestraParams {
  id: string;
}

export const postOrchestra = async (
  req: express.Request<PostOrchestraParams, void, Orchestra>,
  res: express.Response<void | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, authorization');
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.set('Access-Control-Max-Age', '3600');
  const db = admin.firestore();
  const { body } = req;

  try {
    const orchestraRef = db
      .collection(COLLECTION_NAMES.orchestra)
      .doc(req.params.id);
    await orchestraRef.update({
      name: body.name,
      membersCount: body.membersCount,
      conductor: body.conductor,
      subConductor: body.subConductor,
      homePage: body.homePage,
    });

    return res.status(200);
  } catch (error) {
    console.error(error, req, res);
    return res.status(500);
  }
};
