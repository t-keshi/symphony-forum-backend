import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import { router } from './infra/router';
import serviceAccount from './serviceAccount.json';
import logger = require('morgan');

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

app.use(logger('short'));
router(app);

exports.api = functions.region('asia-northeast1').https.onRequest(app);
