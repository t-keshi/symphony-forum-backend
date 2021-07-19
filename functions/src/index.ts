import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { onOrchestraCreate } from './controller/authentication/onOrchestraCreate';
import { onUserSignUp } from './controller/authentication/onUserSignUp';
import { onOrchestraUpdate } from './controller/concert/onOrchestraUpdate';
import { onConcertCancel } from './controller/participation/onConcertCancel';
import { onConcertParticipate } from './controller/participation/onConcertParticipate';
import { onProfileUpdate } from './controller/participation/onProfileUpdate';
import { router } from './infra/router';
import serviceAccount from './serviceAccount.json';
import logger = require('morgan');
import cors = require('cors');

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp({ credential: admin.credential.cert(params) });

const app = express();

app.use(cors({ credentials: true }));
app.use(logger('short'));
router(app);

exports.api = functions.region('asia-northeast1').https.onRequest(app);

exports.signUp = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(onUserSignUp);

exports.orchestraUpdate = functions
  .region('asia-northeast1')
  .firestore.document('orchestra/{orchestraId}')
  .onUpdate(onOrchestraUpdate);

exports.orchestraCreate = functions
  .region('asia-northeast1')
  .firestore.document('orchestra/{orchestraId}')
  .onCreate(onOrchestraCreate);

exports.concertParticipate = functions
  .region('asia-northeast1')
  .firestore.document('participation/{participateId}')
  .onCreate(onConcertParticipate);

exports.concertCancel = functions
  .region('asia-northeast1')
  .firestore.document('participation/{participateId}')
  .onDelete(onConcertCancel);

exports.profileUpdate = functions
  .region('asia-northeast1')
  .firestore.document('user/{uid}')
  .onUpdate(onProfileUpdate);
