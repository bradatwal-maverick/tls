/**
 * Trade Licence Solutions: enquiry email relay for Dan.
 *
 * Emails Dan each enquiry from the website, with the customer's email as reply-to,
 * so he can reply from Gmail. Enquiries are also saved in the enquiry dashboard database (D1).
 * This script does not use a Google Sheet.
 *
 * Setup is in apps-script/SETUP.md.
 */

// Must match the GMAIL_RELAY_KEY value set on the Worker. Make up a long random word.
const RELAY_KEY = 'CHANGE_ME_TO_A_LONG_RANDOM_KEY';

// Where the email goes.
const DAN_EMAIL = 'dpleaner@gmail.com';

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
