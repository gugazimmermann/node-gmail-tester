/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable camelcase */
const fs = require('fs');
const readline = require('readline');
const { resolve } = require('path');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = '../../../gmail.credentials.json';
const TOKEN_PATH = '../../../gmail.token.json';

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    'Enter the code from that page (all after "http://localhost/?code=") here: ',
    (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(
          resolve(__dirname, CREDENTIALS_PATH).toString(),
          JSON.stringify(token),
          (err) => {
            if (err) return console.error(err);
            console.log(
              'Token stored to',
              resolve(__dirname, CREDENTIALS_PATH).toString(),
            );
          },
        );
        callback(oAuth2Client);
      });
    },
  );
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.labels.list(
    {
      userId: 'me',
    },
    (err, res) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      const { labels } = res.data;
      if (labels.length) {
        console.log('Labels:');
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log('No labels found.');
      }
    },
  );
}

fs.readFile(resolve(__dirname, CREDENTIALS_PATH).toString(), (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listLabels);
});
