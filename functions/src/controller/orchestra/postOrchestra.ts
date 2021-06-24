import express = require('express');
import admin = require('firebase-admin');
import { Orchestra } from '../../domain/orchestra';
import { COLLECTION_NAMES } from '../../infra/endPoints';
import { ErrorResponse } from '../errors';

interface PostOrchestraParams {
  id: string;
}

export const postOrchestra = async (
  req: express.Request<PostOrchestraParams, void, Orchestra>,
  res: express.Response<void | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
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
