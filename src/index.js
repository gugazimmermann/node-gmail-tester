import getRecentEmail from './utils/gmail';
import auth from './utils/auth';
import store from './utils/store';

/**
 * Check inbox.
 *
 * @param {CheckInboxOptions} [options]
 * @param {string} [options.subject] - Filter on the subject of the email.
 * @param {string} [options.from] - Filter on the email address of the receiver.
 * @param {string} [options.to] - Filter on the email address of the sender.
 * @param {boolean} [options.includeBody] - Set to `true` to fetch decoded email bodies.
 * @param {boolean} [options.includeAttachments] - Set to `true` to fetch email attachments.
 * @param {Date} [options.before] - Date. Filter messages received _after_ the specified date.
 * @param {Date} [options.after] - Date. Filter messages received _before_ the specified date.
 * @param {string} [options.label] - String. The default label is 'INBOX', but can be changed
 * to 'SPAM', 'TRASH' or a custom label. For a full list of built-in labels,
 * see https://developers.google.com/gmail/api/guides/labels?hl=en
 * @param {number} [options.waitTimeSec] - Interval between inbox checks (in seconds).
 * Default: 30 seconds.
 * @param {number} [options.maxWaitTimeSec] - Maximum wait time (in seconds).
 * When reached and the email was not found, the script exits. Default: 60 seconds.
 */
export const checkInbox = async (
  options = {
    subject: undefined,
    from: undefined,
    to: undefined,
    includeBody: false,
    includeAttachments: false,
    before: undefined,
    after: undefined,
    label: 'INBOX',
    waitTimeSec: 30,
    maxWaitTimeSec: 30,
  },
) => {
  const { waitTimeSec, maxWaitTimeSec } = options;
  let foundEmails = null;
  let doneWaitingTime = 0;
  do {
    const emails = await getRecentEmail(options);
    if (emails.length > 0) {
      foundEmails = emails;
      break;
    }
    doneWaitingTime += waitTimeSec;
    if (doneWaitingTime >= maxWaitTimeSec) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, waitTimeSec * 1000));
  } while (!foundEmails);
  return foundEmails;
};

/**
 * Refreshes Access Token
 */
export const refreshToken = async () => {
  const oAuth2Client = await auth.authorize();
  const res = await oAuth2Client.refreshToken(
    oAuth2Client.credentials.refresh_token,
  );
  if (res && res.tokens) {
    const token = store.getToken();
    if (res.tokens.access_token) {
      token.access_token = res.tokens.access_token;
    }
    if (res.tokens.refresh_token) {
      token.refresh_token = res.tokens.refresh_token;
    }
    if (res.tokens.expiry_date) {
      token.expiry_date = res.tokens.expiry_date;
    }
    store.storeToken(token);
  } else {
    throw new Error(
      `Refresh access token failed! Respose: ${JSON.stringify(res)}`,
    );
  }
};
