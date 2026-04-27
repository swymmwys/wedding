/**
 * Wedding site RSVP webhook — matches frontend RsvpPayload (src/types/rsvp.ts;
 * submittedAt is set server-side) and form rules (src/features/rsvp/rsvpSchema.ts).
 *
 * Setup: Project Settings → Script properties → SPREADSHEET_ID (required),
 * optional SHEET_NAME (default "rsvp"). Run setupRsvpSheet_ once from the script
 * editor to create the sheet and header (or verify header). Web requests only append rows.
 * Deploy as Web app: Execute as Me, Who has access: Anyone.
 */

var _rsvpScriptProps = PropertiesService.getScriptProperties();
var SPREADSHEET_ID = _rsvpScriptProps.getProperty('SPREADSHEET_ID');
if (!SPREADSHEET_ID) {
  throw new Error('SPREADSHEET_ID_missing');
}
var SHEET_NAME = _rsvpScriptProps.getProperty('SHEET_NAME') || 'rsvp';

var RSVP_HEADER = [
  'attendance',
  'fullName',
  'dietary',
  'message',
  'submittedAt',
];

var ALLOWED_PAYLOAD_KEYS = {
  guestId: true,
  attendance: true,
  fullName: true,
  dietary: true,
  message: true,
};

const ALLOWED_GUEST_TOKENS = [];

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    validatePayloadKeys_(data);
    var row = rowFromPayload_(data);
    appendRsvpRow_(row);
    return jsonResponse_(true, null);
  } catch (err) {
    return jsonResponse_(false, String(err && err.message ? err.message : err));
  }
}

function jsonResponse_(ok, error) {
  var body = ok ? { ok: true } : { ok: false, error: error };
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function validatePayloadKeys_(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('invalid_payload');
  }
  var allowed = Object.keys(ALLOWED_PAYLOAD_KEYS);
  for (var a = 0; a < allowed.length; a++) {
    if (!Object.prototype.hasOwnProperty.call(data, allowed[a])) {
      throw new Error('missing_field:' + allowed[a]);
    }
  }
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    if (!ALLOWED_PAYLOAD_KEYS[keys[i]]) {
      throw new Error('unknown_field:' + keys[i]);
    }
  }
}

function nullableString_(value, field) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    throw new Error('invalid_' + field);
  }
  return value;
}

function requiredString_(value, field) {
  if (typeof value !== 'string') {
    throw new Error('invalid_' + field);
  }
  return value;
}

function rowFromPayload_(data) {
  var guestId = nullableString_(data.guestId, 'guestId');
  if (ALLOWED_GUEST_TOKENS.indexOf(guestId) === -1) {
    throw new Error('guest_token_not_allowed');
  }

  var attendance = requiredString_(data.attendance, 'attendance');
  if (attendance !== 'yes' && attendance !== 'no') {
    throw new Error('invalid_attendance');
  }

  var fullName = requiredString_(data.fullName, 'fullName').trim();
  if (!fullName) {
    throw new Error('invalid_fullName');
  }

  var dietary = requiredString_(data.dietary, 'dietary');
  var message = requiredString_(data.message, 'message');

  var submittedAt = new Date().toISOString();

  return [attendance, fullName, dietary, message, submittedAt];
}

function getRsvpSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('sheet_not_found');
  }
  return sheet;
}

function ensureHeaderRow_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < RSVP_HEADER.length) {
    sheet.getRange(1, 1, 1, RSVP_HEADER.length).setValues([RSVP_HEADER]);
    return;
  }
  var existing = sheet.getRange(1, 1, 1, RSVP_HEADER.length).getValues()[0];
  var mismatch = false;
  for (var c = 0; c < RSVP_HEADER.length; c++) {
    if (String(existing[c]) !== RSVP_HEADER[c]) {
      mismatch = true;
      break;
    }
  }
  if (mismatch) {
    sheet.getRange(1, 1, 1, RSVP_HEADER.length).setValues([RSVP_HEADER]);
  }
}

function appendRsvpRow_(row) {
  var sheet = getRsvpSheet_();
  sheet.appendRow(row);
}
