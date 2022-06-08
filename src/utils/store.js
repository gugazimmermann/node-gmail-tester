import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const credentialsPath = '../../../gmail.credentials.json';
const tokenPath = '../../../gmail.token.json';

const getCredentials = () => {
  const credentials = JSON.parse(
    readFileSync(resolve(__dirname, credentialsPath).toString()),
  );
  return credentials.installed;
};

const getToken = () => {
  try {
    return JSON.parse(
      readFileSync(resolve(__dirname, tokenPath).toString()),
    );
  } catch (error) {
    throw new Error('No token found.');
  }
};

const storeToken = (token) => {
  try {
    writeFileSync(
      resolve(__dirname, tokenPath).toString(),
      JSON.stringify(token),
    );
  } catch (error) {
    throw new Error('Error while write token file');
  }
};

const store = { getCredentials, getToken, storeToken };

export default store;
