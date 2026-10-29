(function setDynamicManifest() { try { const link = document.querySelector('link[rel="manifest"]'); if (!link) return; const manifest = { name: 'Stempelkarte', short_name: 'Stempel', start_url: location.href, scope: new URL('./', location.href).href, display: 'standalone', background_color: '#F5E6CC', theme_color: '#8B5A2B', icons: [ { src: new URL('icon-192.png', location.href).href, sizes: '192x192', type: 'image/png' }, { src: new URL('icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' } ] }; link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' })); } catch (e) {} })();
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
  $('msg').textContent = 'Diese Karte ist noch nicht geöffnet. Bitte den Link oder QR-Code vom Personal in Safari öffnen und erst dann zum Home-Bildschirm hinzufügen.';
} else {
  load();
  setInterval(load, 60000);
}
