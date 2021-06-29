import express = require('express');
import { ErrorResponse, ERRORS } from '../../constants/errors';
import { Concert } from '../../domain/concert';
import { OmitId } from '../../utility';

interface PutConcertParams {
  id: string;
}
type PutConcertReqBody = OmitId<Concert>;

export const put = async (
  req: express.Request<PutConcertParams, void, PutConcertReqBody>,
  res: express.Response<void | string | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);

  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Max-Age', '3600');
    return res.status(200).send('success');
  } catch (error) {
    console.error(error, req, res);
    res.set('Access-Control-Allow-Origin', '*');
    return res.status(400).send({ error: ERRORS.ConcertNotFound });
  }
};
