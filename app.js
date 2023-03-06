const express = require('express');
const { google } = require('googleapis');

const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

const app = express();
const port = 3000;

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getAccessToken() {
    return new Promise(function(resolve, reject) {
      const key = require('./firebase-admin.json');
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
}

app.get('/', async(req, res) => {
    const token = await getAccessToken()

    res.json(token);
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});