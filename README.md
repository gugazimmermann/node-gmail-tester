# node-gmail-tester

[![npm version](https://badge.fury.io/js/node-gmail-tester.svg)](https://www.npmjs.com/package/node-gmail-tester) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!--
[![Github All Releases](https://img.shields.io/github/downloads/gugazimmermann/node-gmail-tester/total.svg)]()
![GitHub stars](https://img.shields.io/github/stars/gugazimmermann/node-gmail-tester?style=social)
-->

A Node.js Gmail client which returns email from any Gmail account.<br/>

## Usage

Install using `npm`:

```bash
npm install --save-dev node-gmail-tester
```

```bash
yarn add --dev node-gmail-tester
```

* Create a Google Cloud Project (<https://developers.google.com/workspace/guides/create-project>).

* Create the Access Credentials and make sure to select `Desktop app` for the application type. (<https://developers.google.com/workspace/guides/create-credentials>).

* Make sure you have enabled Gmail API for the progect.

* Save the Google Cloud Platform OAuth2 Authentication file named `gmail.credentials.json` in the root of the project folder.

* To create the tokens run the following command in the root of the project and follow the instructions, this will create the file `gmail.token.json`.

```bash
node node_modules/node-gmail-tester/init
```

⛔️ **Never share or commit `gmail.credentials.json` nor `gmail.token.json`!**

## Credits

* Built using [googleapis](https://github.com/googleapis/googleapis).
