import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const credentialsPath = './config/credentials.json';
const tokenPath = './config/token.json';

const getCredentials = () => {
  const test = resolve(__dirname, credentialsPath).toString();
  console.log(test);
  const credentials = JSON.parse(
    readFileSync(test),
  );
  return credentials.installed;
};

const getToken = () => {
  const test = resolve(__dirname, tokenPath).toString();
  console.log(test);
  try {
    return JSON.parse(
      readFileSync(test),
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
