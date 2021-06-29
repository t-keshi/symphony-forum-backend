import express = require('express');
import { ErrorResponse } from '../../constants/errors';
import { Orchestra } from '../../domain/orchestra';

interface PostConcertReq {
  title: string;
  date: Date;
  location: {
    address: string;
    placeId: string;
  };
  symphonies: string[];
  orchestra: {
    id: Orchestra['id'];
    name: Orchestra['name'];
  };
}

export const options = async (
  req: express.Request<void, void, PostConcertReq>,
  res: express.Response<void | string | ErrorResponse>,
) => {
  req.setTimeout(5 * 60 * 1000);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
  res.header(
    'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.header('Access-Control-Max-Age', '3600');

  return res.status(200).send('success');
};
