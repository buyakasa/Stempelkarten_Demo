const C = window.STEMPEL_CONFIG;
const $ = (id) => document.getElementById(id);

$('shop').textContent = C.name;
$('sub').textContent = C.subtitle;
$('demo').textContent = C.demoNotice || '';
document.title = `${C.name} – Stempelkarte`;

// Karten-ID aus Link übernehmen und merken (wichtig, falls das Handy die App
// später ohne ?id= startet)
const params = new URLSearchParams(location.search);
let id = params.get('id');
if (id) {
  localStorage.setItem('stempel-id', id);
} else {
  id = localStorage.getItem('stempel-id');
}

let qrRendered = false;

async function load() {
  try {
    const r = await fetch(`${C.apiUrl}?action=card&id=${encodeURIComponent(id)}`);
    const d = await r.json();
    if (!d.ok) {
      $('msg').textContent = d.error;
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

if (!id) {
  $('msg').textContent = 'Bitte den Link oder QR-Code vom Personal öffnen.';
} else {
  load();
  setInterval(load, 60000);
}
