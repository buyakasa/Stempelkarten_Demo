// Backend für die Stempelkarte – läuft in Google Apps Script, Daten in einem Google Sheet.
// Einrichtung: siehe README.md

const SHEET_NAME = 'Karten';
const STAMPS_TOTAL = 10;        // muss mit config.js übereinstimmen
const COOLDOWN_MIN = 0;         // TESTPHASE: 0 = beliebig oft stempeln. Für echten Betrieb wieder auf 120 setzen!

function getPin_() {
  const pin = PropertiesService.getScriptProperties().getProperty('PIN');
  if (!pin) throw new Error('PIN fehlt: unter Projekteinstellungen > Skripteigenschaften eintragen');
  return pin;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'erstellt', 'stempel', 'letzter_stempel']);
  }
  return sh;
}

function findRow_(sh, id) {
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return { row: i + 1, values: data[i] };
  }
  return null;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Kundenseite liest den Stand (ohne PIN)
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'card') {
    const r = findRow_(sheet_(), e.parameter.id);
    if (!r) return json_({ ok: false, error: 'Karte nicht gefunden' });
    return json_({ ok: true, stamps: Number(r.values[2]), total: STAMPS_TOTAL });
  }
  return json_({ ok: false, error: 'Unbekannte Aktion' });
}

// Personal-Aktionen (mit PIN)
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (String(body.pin) !== getPin_()) return json_({ ok: false, error: 'PIN falsch' });

  if (body.action === 'ping') return json_({ ok: true });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();

    if (body.action === 'create') {
      const id = Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
      sh.appendRow([id, new Date(), 0, '']);
      return json_({ ok: true, id: id, stamps: 0, total: STAMPS_TOTAL });
    }

    const r = findRow_(sh, body.id);
    if (!r) return json_({ ok: false, error: 'Karte nicht gefunden' });
    const current = Number(r.values[2]);

    if (body.action === 'stamp') {
      const last = r.values[3];
      const now = new Date();
      if (last && now - new Date(last) < COOLDOWN_MIN * 60 * 1000) {
        return json_({ ok: false, error: 'Schon gestempelt – bitte etwas warten', stamps: current, total: STAMPS_TOTAL });
      }
      if (current >= STAMPS_TOTAL) {
        return json_({ ok: false, error: 'Karte ist voll – bitte Prämie einlösen', stamps: current, total: STAMPS_TOTAL });
      }
      const stamps = current + 1;
      sh.getRange(r.row, 3, 1, 2).setValues([[stamps, now]]);
      return json_({ ok: true, stamps: stamps, total: STAMPS_TOTAL });
    }

    if (body.action === 'redeem') {
      if (current < STAMPS_TOTAL) return json_({ ok: false, error: 'Karte ist noch nicht voll', stamps: current, total: STAMPS_TOTAL });
      sh.getRange(r.row, 3, 1, 2).setValues([[0, '']]);
      return json_({ ok: true, stamps: 0, total: STAMPS_TOTAL });
    }

    return json_({ ok: false, error: 'Unbekannte Aktion' });
  } finally {
    lock.releaseLock();
  }
}
