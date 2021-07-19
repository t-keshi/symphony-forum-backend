import express from 'express';
import { postBelong } from '../controller/belong/postBelong';
import { getConcert } from '../controller/concert/getConcert';
import { getConcerts } from '../controller/concert/getConcerts';
import { options } from '../controller/concert/options';
import { postConcert } from '../controller/concert/postConcert';
import { putConcert } from '../controller/concert/putConcert';
import { error } from '../controller/error';
import { getOrchestra } from '../controller/orchestra/getOrchestra';
import { getOrchestras } from '../controller/orchestra/getOrchestras';
import { postOrchestra } from '../controller/orchestra/postOrchestra';
import { putOrchestra } from '../controller/orchestra/putOrchestra';
import { END_POINTS } from './endPoints';

export const router = (app: express.Express): void => {
  // concert
  app.get(`/${END_POINTS.concerts}`, getConcerts);
  app.get(`/${END_POINTS.concerts}/:id`, getConcert);
  app.post(`/${END_POINTS.concerts}`, postConcert);
  app.put(`/${END_POINTS.concerts}`, putConcert);
  app.options(`/${END_POINTS.concerts}`, options);
  // orchestra
  app.get(`/${END_POINTS.orchestras}`, getOrchestras);
  app.get(`/${END_POINTS.orchestras}/:id`, getOrchestra);
  app.post(`/${END_POINTS.orchestras}`, postOrchestra);
  app.put(`/${END_POINTS.orchestras}`, putOrchestra);
  // belong
  app.post(`/${END_POINTS.belong}`, postBelong);
  // error
  app.use(error);
};
