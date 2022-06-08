/* eslint-disable camelcase */
import { google } from 'googleapis';
import store from './store';

const gmailClient = (oAuth2Client) => google.gmail({ version: 'v1', oAuth2Client });

const authorize = async () => {
  const { client_secret, client_id, redirect_uris } = store.getCredentials();
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );
  oAuth2Client.setCredentials(store.getToken());
  return oAuth2Client;
};

const auth = { gmailClient, authorize };

export default auth;
