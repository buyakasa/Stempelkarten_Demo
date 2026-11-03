# Salon Feinschnitt – Website + App + Stempelkarte

Friseur-Variante der Bäckerei Musterkorn (gleicher Aufbau, gleiches Backend-Skript).
Eine Web-App: Website, Home-Bildschirm-App und digitale Stempelkarte in einem (fiktiver Musterbetrieb).

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Website **und** Kunden-App: Stempelkarte (gleich nach dem Startbild), Leistungen und Preise, Terminanfrage, Öffnungszeiten, Ablauf, Installationshilfe. Am Handy mit Tab-Leiste unten. |
| `mitarbeiter.html` + `app-mitarbeiter.js` | Personal: PIN, QR scannen, +1 Stempel, Prämie einlösen, neue Karte anlegen. |
| `config.js` | Name, Prämie, Anzahl Stempel, API-URL. |
| `backend/` | Google Apps Script (identisch mit der Bäckerei), eigene Tabelle "Feinschnitt Stempelkarte". |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | Home-Bildschirm-App, offline nutzbar. |

Keine Fotos: Die Startgrafik ist gezeichnet (keine Bildrechte nötig). Für echte Kunden eigene Fotos ergänzen.
Leistungen, Preise und Öffnungszeiten stehen oben im Skript von `index.html` (`SERVICES`, `HOURS`).

Speicher-Schlüssel im Browser beginnen mit `feinschnitt-`, damit sich Salon- und Bäckerei-Karte
auf derselben Domain (buyakasa.github.io) nicht vermischen.

## Backend (angelegt am 29.10.2026)

- Google-Tabelle: https://drive.google.com/open?id=1AjWUX3ejNWR8nR_i664Wh4McHpTDOoCrdGwsf0uup-E
- Skript-Editor: https://script.google.com/d/1z5QmtCd9XjTB1y9MLQkFjj2ij5WKZfIRRluXFRpnOboMWY--lR1N9dP5/edit
- Web-App-URL steht in `config.js` (Bereitstellung "Feinschnitt Stempelkarte", Version 1).
- **Einmalig nötig:** Im Skript-Editor Funktion `einrichten` auswählen → Ausführen → Google-Berechtigungen erlauben.
  Danach Zahnrad → Skripteigenschaften → `PIN` auf eine eigene Zahl ändern. Vorher antwortet das Backend nicht.
- Die PIN gehört nicht ins öffentliche Repository.
- **Testphase:** `COOLDOWN_MIN = 0` in `backend/Code.gs`. Vor echtem Betrieb auf `120` setzen, `clasp push`, neu bereitstellen.
- Nach Änderungen an Dateien in `sw.js` die Zeile `const CACHE = 'feinschnitt-v2'` hochzählen (aktuell v2).

## Noch offen für echte Kunden

- Texte, Preise, Öffnungszeiten, Adresse, Team-Namen anpassen, eigene Fotos
- Impressum und Datenschutzerklärung ergänzen
- Terminanfrage ist nur Oberfläche (sendet nichts)
