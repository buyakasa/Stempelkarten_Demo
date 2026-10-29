const C = window.STEMPEL_CONFIG;
const $ = (id) => document.getElementById(id);

$('shop').textContent = C.name;
$('sub').textContent = C.subtitle;
$('demo').textContent = C.demoNotice || '';
document.title = `${C.name} – Stempelkarte`;

// Kartennummer: kommt aus dem Link (?id=...) oder aus dem Speicher der App.
// Die Home-Bildschirm-App hat einen eigenen Speicher; dort wird die Nummer
// beim ersten Eingeben gemerkt.
const KEY = 'stempel-id';
const params = new URLSearchParams(location.search);
let id = (params.get('id') || '').toUpperCase().trim();
try {
  if (id) {
    localStorage.setItem(KEY, id);
  } else {
    id = (localStorage.getItem(KEY) || '').trim();
  }
} catch (e) { /* Speicher nicht verfügbar: Nummer muss jedes Mal eingegeben werden */ }

let qrRendered = false;
let timer = null;

function showIdForm() {
  $('msg').textContent = 'Bitte deine Kartennummer eingeben. Du findest sie beim Personal auf der Karte.';
  $('idForm').classList.remove('hidden');
  $('idInput').focus();
}

function saveAndStart() {
  const v = $('idInput').value.toUpperCase().trim();
  if (!/^[A-Z0-9]{6,12}$/.test(v)) {
    $('msg').textContent = 'Bitte eine gültige Kartennummer eingeben (Buchstaben und Zahlen).';
    return;
  }
  try { localStorage.setItem(KEY, v); } catch (e) { /* ignorieren */ }
  id = v;
  $('idForm').classList.add('hidden');
  start();
}

function forgetCard() {
  try { localStorage.removeItem(KEY); } catch (e) { /* ignorieren */ }
  location.href = location.pathname;
}

function start() {
  $('msg').textContent = 'Karte wird geladen … bitte einen Moment warten.';
  load();
  if (timer) clearInterval(timer);
  timer = setInterval(load, 60000);
}

async function load() {
  try {
    const r = await fetch(`${C.apiUrl}?action=card&id=${encodeURIComponent(id)}`);
    const d = await r.json();
    if (!d.ok) {
      $('card').classList.add('hidden');
      $('qrBox').classList.add('hidden');
      $('msg').textContent = d.error + ' – bitte Kartennummer prüfen.';
      $('forget').classList.remove('hidden');
      return;
    }
    $('msg').textContent = '';
    render(d.stamps);
  } catch (e) {
    $('msg').textContent = 'Keine Verbindung. Bitte später noch einmal öffnen.';
  }
}

function render(n) {
  $('card').classList.remove('hidden');
  $('qrBox').classList.remove('hidden');
  $('forget').classList.remove('hidden');
  $('cardno').textContent = `Kartennummer: ${id}`;

  const grid = $('stamps');
  grid.innerHTML = '';
  for (let i = 0; i < C.stampsTotal; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot' + (i < n ? ' filled' : '');
    slot.textContent = i < n ? '✓' : String(i + 1);
    grid.appendChild(slot);
  }

  $('count').textContent = `${n} von ${C.stampsTotal} Stempeln`;
  $('reward').textContent = n >= C.stampsTotal
    ? `🎉 Prämie fällig: ${C.reward}`
    : `Noch ${C.stampsTotal - n} bis: ${C.reward}`;

  if (!qrRendered && typeof qrcode !== 'undefined') {
    const qr = qrcode(0, 'M');
    qr.addData(`${location.origin}${location.pathname}?id=${id}`);
    qr.make();
    $('qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2 });
    qrRendered = true;
  }
}

$('idBtn').onclick = saveAndStart;
$('idInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveAndStart(); });
$('forget').onclick = forgetCard;

if (id) {
  start();
} else {
  showIdForm();
}
