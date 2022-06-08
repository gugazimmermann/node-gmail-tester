import auth from './auth';

const getHeader = (name, headers) => {
  const found = headers.find((h) => h.name === name);
  return found && found.value;
};

const formatQuery = (options) => {
  const {
    to, from, subject, before, after,
  } = options;
  let query = '';
  if (to) {
    query += `to:(${to}) `;
  }
  if (from) {
    query += `from:(${from}) `;
  }
  if (subject) {
    query += `subject:(${subject}) `;
  }
  if (after) {
    const afterEpoch = Math.round(new Date(after).getTime() / 1000);
    query += `after:${afterEpoch} `;
  }
  if (before) {
    const beforeEpoch = Math.round(new Date(before).getTime() / 1000);
    query += `before:${beforeEpoch} `;
  }
  query = query.trim();
  return query;
};

const listLabels = async (gmail, oauth2Client) => {
  const labels = await new Promise((resolve, reject) => {
    gmail.users.labels.list(
      { userId: 'me', auth: oauth2Client },
      (err, res) => {
        if (err) reject(err);
        else resolve(res.data.labels);
      },
    );
  });
  return labels;
};

const listMessages = async (gmail, oauth2Client, query, labelIds) => {
  const messages = await new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        userId: 'me',
        auth: oauth2Client,
        labelIds,
        q: query,
      },
      async (err, res) => {
        if (err) {
          reject(err);
        } else {
          let result = res.data.messages || [];
          let { nextPageToken } = res.data;
          while (nextPageToken) {
            const resp = await new Promise((resolve, reject) => {
              gmail.users.messages.list(
                {
                  userId: 'me',
                  auth: oauth2Client,
                  labelIds,
                  q: query,
                  pageToken: nextPageToken,
                },
                (err, res) => {
                  if (err) reject(err);
                  else resolve(res);
                },
              );
            });
            result = result.concat(resp.data.messages);
            nextPageToken = resp.data.nextPageToken;
          }
          resolve(result);
        }
      },
    );
  });
  return messages || [];
};

const getBody = (payload) => {
  const emailBody = { html: '', text: '' };
  if (payload.body.size) {
    if (payload.mimeType === 'text/html') {
      emailBody.html = Buffer.from(
        payload.body.data,
        'base64',
      ).toString('utf8');
    } else {
      emailBody.text = Buffer.from(
        payload.body.data,
        'base64',
      ).toString('utf8');
    }
  } else {
    let parts = [...payload.parts];
    while (parts.length) {
      const part = parts.shift();
      if (part.parts) {
        parts = parts.concat(part.parts);
      }
      if (part.mimeType === 'text/plain') {
        emailBody.text = Buffer.from(part.body.data, 'base64').toString(
          'utf8',
        );
      } else if (part.mimeType === 'text/html') {
        emailBody.html = Buffer.from(part.body.data, 'base64').toString(
          'utf8',
        );
      }
    }
  }
  return emailBody;
};

const getAttachments = async (oauth2Client, email) => {
  const parts = email.payload.parts || [];
  const infos = parts
    .filter((part) => part.body.size && part.body.attachmentId)
    .map(({ body, filename, mimeType }) => ({
      id: body.attachmentId,
      filename,
      mimeType,
    }));
  return Promise.all(
    infos.map(async ({ id, filename, mimeType }) => {
      const {
        data: { data: base64Data },
      } = await auth.gmailClient(oauth2Client).users.messages.attachments.get({
        auth: oauth2Client,
        userId: 'me',
        messageId: email.id,
        id,
      });
      return { data: base64Data, filename, mimeType };
    }),
  );
};

const utils = {
  getHeader,
  formatQuery,
  listLabels,
  listMessages,
  getBody,
  getAttachments,
};

export default utils;
