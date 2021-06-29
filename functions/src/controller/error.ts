import express = require('express');
import { ErrorResponse, ERRORS } from '../constants/errors';

export const error = async (
  _: unknown,
  __: unknown,
  res: express.Response<void | string | ErrorResponse>,
) => {
  return res.status(500).json({ error: ERRORS.InternalServerError });
};
