const C = window.STEMPEL_CONFIG;
const $ = (id) => document.getElementById(id);

$('shopM').textContent = C.name;

let pin = sessionStorage.getItem('stempel-pin');
let currentId = null;
let stream = null;

async function post(body) {
  const r = await fetch(C.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ pin, ...body }),
  });
  const d = await r.json();
  if (d.error === 'PIN falsch') {
    sessionStorage.removeItem('stempel-pin');
    location.reload();
  }
  return d;
}

async function get(params) {
  const r = await fetch(`${C.apiUrl}?${new URLSearchParams(params)}`);
  return r.json();
}

// ---------- Login ----------
$('loginBtn').onclick = async () => {
  pin = $('pin').value.trim();
  const d = await post({ action: 'ping' });
  if (d.ok) {
    sessionStorage.setItem('stempel-pin', pin);
    showApp();
  } else {
    $('loginMsg').textContent = d.error || 'Fehler';
  }
};
$('pin').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('loginBtn').click(); });

function showApp() {
  $('login').classList.add('hidden');
  $('app').classList.remove('hidden');
  startCamera();
}
if (pin) showApp();

// ---------- Kamera & QR-Scan ----------
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const v = $('video');
    v.srcObject = stream;
    await v.play();
    requestAnimationFrame(tick);
  } catch (e) {
    $('result').textContent = 'Kamera nicht verfügbar – bitte Code manuell eingeben.';
  }
}

function parseId(text) {
  try {
    const u = new URL(text);
    return u.searchParams.get('id');
  } catch (e) {
    const t = text.trim().toUpperCase();
    return /^[A-Z0-9]{6,12}$/.test(t) ? t : null;
  }
}

function tick() {
  const v = $('video');
  if (!currentId && typeof jsQR !== 'undefined' && v.readyState === v.HAVE_ENOUGH_DATA) {
    const c = $('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    if (code) {
      const id = parseId(code.data);
      if (id) openCard(id);
    }
  }
  requestAnimationFrame(tick);
}

// ---------- Karte öffnen & stempeln ----------
async function openCard(id) {
  currentId = id;
  const d = await get({ action: 'card', id });
  if (!d.ok) {
    $('result').textContent = d.error;
    currentId = null;
    return;
  }
  renderPanel(d);
}

function renderPanel(d) {
  $('cardPanel').classList.remove('hidden');
  $('cardInfo').textContent = `Karte ${currentId}: ${d.stamps} von ${C.stampsTotal}`;

  const grid = $('stampsM');
  grid.innerHTML = '';
  for (let i = 0; i < C.stampsTotal; i++) {
    const s = document.createElement('div');
    s.className = 'slot' + (i < d.stamps ? ' filled' : '');
    s.textContent = i < d.stamps ? '✓' : String(i + 1);
    grid.appendChild(s);
  }

  const full = d.stamps >= C.stampsTotal;
  $('stampBtn').disabled = full;
  $('redeemBtn').classList.toggle('hidden', !full);
}

$('useManual').onclick = () => {
  const id = parseId($('manual').value);
  if (id) openCard(id);
  else $('result').textContent = 'Ungültige Karten-ID.';
};

$('stampBtn').onclick = async () => {
  const d = await post({ action: 'stamp', id: currentId });
  if (d.ok) {
    renderPanel(d);
    $('result').textContent = d.stamps === C.stampsTotal
      ? 'Gestempelt – Prämie fällig!'
      : 'Gestempelt ✓';
  } else {
    $('result').textContent = d.error;
    if (d.stamps !== undefined) renderPanel(d);
  }
};

$('redeemBtn').onclick = async () => {
  const d = await post({ action: 'redeem', id: currentId });
  if (d.ok) {
    renderPanel(d);
    $('result').textContent = 'Prämie eingelöst – Karte ist wieder leer.';
  } else {
    $('result').textContent = d.error;
  }
};

$('nextBtn').onclick = () => {
  currentId = null;
  $('cardPanel').classList.add('hidden');
  $('result').textContent = '';
  $('manual').value = '';
};

// ---------- Neue Karte ----------
$('newBtn').onclick = async () => {
  const d = await post({ action: 'create' });
  if (!d.ok) {
    $('result').textContent = d.error;
    return;
  }
  const base = location.href.replace(/[^/]*$/, '');
  const link = `${base}index.html?id=${d.id}`;
  const qr = qrcode(0, 'M');
  qr.addData(link);
  qr.make();
  $('newQr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2 });
  $('newLink').textContent = `Kartennummer: ${d.id}`;
  $('newPanel').dataset.link = link;
  $('newPanel').classList.remove('hidden');
};
