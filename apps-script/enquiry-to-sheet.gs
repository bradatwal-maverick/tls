/**
 * Trade Licence Solutions: enquiry relay for Dan.
 *
 * What it does, for each enquiry from the website:
 *  1. Adds a row to the Google Sheet this script is attached to.
 *  2. Emails Dan, with the customer's email as reply-to, so he can reply from Gmail.
 *
 * Setup is in apps-script/SETUP.md. Owner: Dan's Google account.
 */

// Must match the GMAIL_RELAY_KEY value set on the Worker. Make up a long random word.
const RELAY_KEY = 'CHANGE_ME_TO_A_LONG_RANDOM_KEY';

// Where the email goes.
const DAN_EMAIL = 'dpleaner@gmail.com';

// Column order in the sheet. Row 1 is written automatically if the sheet is empty.
const HEADERS = ['Submitted (AEST)', 'Name', 'Phone', 'Email', 'State', 'Licence needed', 'Message', 'Source page'];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad json' });
  }
  if (data.key !== RELAY_KEY) {
    return reply({ ok: false, error: 'bad key' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  const when = Utilities.formatDate(new Date(), 'Australia/Sydney', 'dd/MM/yyyy HH:mm');
  sheet.appendRow([
    when,
    data.name || '',
    data.phone || '',
    data.email || '',
    data.state || '',
    data.licence || '',
    data.message || '',
    data.source || '',
  ]);

  const lines = [
    'Name: ' + (data.name || ''),
    'Phone: ' + (data.phone || ''),
    'Email: ' + (data.email || 'not given'),
    'State: ' + (data.state || 'not given'),
    'Licence needed: ' + (data.licence || 'not given'),
    '',
    data.message || '(no message)',
    '',
    'Sent from: ' + (data.source || 'website'),
    'Reply to this email to answer the customer directly.',
  ];

  MailApp.sendEmail({
    to: DAN_EMAIL,
    replyTo: data.email && data.email.indexOf('@') > 0 ? data.email : DAN_EMAIL,
    subject: 'New enquiry: ' + (data.name || 'website') + ' (' + (data.state || 'state not given') + ')',
    body: lines.join('\n'),
  });

  return reply({ ok: true });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
