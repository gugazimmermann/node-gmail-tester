import auth from './auth';
import utils from './utils';

const getEmails = async (oauth2Client, query = '', label = 'INBOX') => {
  const client = auth.gmailClient(oauth2Client);
  const labels = await utils.listLabels(client, oauth2Client);
  const inboxLabelID = [labels.find((l) => l.name === label).id];
  const messages = await utils.listMessages(
    client,
    oauth2Client,
    query,
    inboxLabelID,
  );
  const promises = [];
  messages.forEach((message) => {
    promises.push(
      new Promise((resolve, reject) => {
        client.users.messages.get(
          {
            auth: oauth2Client,
            userId: 'me',
            id: message.id,
            format: 'full',
          },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          },
        );
      }),
    );
  });
  const results = await Promise.all(promises);
  return results.map((r) => r.data);
};

const getRecentEmail = async (options = {}) => {
  const emails = [];
  const query = utils.formatQuery(options);
  const oAuth2Client = await auth.authorize();
  const gmailEmails = await getEmails(oAuth2Client, query, options.label);
  gmailEmails.forEach(async (gmailEmail) => {
    const email = {
      from: utils.getHeader('From', gmailEmail.payload.headers),
      subject: utils.getHeader('Subject', gmailEmail.payload.headers),
      receiver: utils.getHeader('Delivered-To', gmailEmail.payload.headers),
      date: new Date(+gmailEmail.internalDate),
    };
    if (options.includeBody) {
      email.body = utils.getBody(gmailEmail.payload);
    }
    if (options.includeAttachments) {
      email.attachments = await utils.getAttachments(oAuth2Client, gmailEmail);
    }
    emails.push(email);
  });
  return emails;
};

export default getRecentEmail;
