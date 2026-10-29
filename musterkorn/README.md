# Bäckerei Musterkorn – Website + App + Stempelkarte

Eine Web-App: Bäckerei-Website, Home-Bildschirm-App und digitale Stempelkarte in einem (fiktiver Musterbetrieb).

- Kunden-App: `index.html` (Sortiment, Vorbestellung, eigene Stempelkarte mit QR-Code, Öffnungszeiten)
- Personal: `mitarbeiter.html` (PIN, QR scannen, +1 Stempel, Prämie einlösen, neue Karte)
- Backend: `backend/` (Google Apps Script, Daten in Google Sheet). Die PIN steht nur in den Skripteigenschaften, nicht hier.
- Einstellungen: `config.js`

**Testphase:** `COOLDOWN_MIN = 0` in `backend/Code.gs` (beliebig oft stempeln). Vor echtem Betrieb auf `120` setzen und neu bereitstellen.
Nach Dateiänderungen `CACHE` in `sw.js` hochzählen.

Fotos: Unsplash. Vorbestellung ist nur Oberfläche und sendet nichts.
