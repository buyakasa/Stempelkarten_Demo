# Bäckerei Musterkorn – Website + App + Stempelkarte

Eine einzige Web-App: Website, Home-Bildschirm-App und digitale Stempelkarte in einem.
Kosten: 0 € (GitHub Pages + Google Apps Script). Basiert auf dem Ordner `Stempelkarte`.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Website **und** Kunden-App: Sortiment, Vorbestellung, eigene Stempelkarte mit QR-Code, Öffnungszeiten, Installationshilfe. Am Handy mit Tab-Leiste unten. |
| `mitarbeiter.html` + `app-mitarbeiter.js` | Personal: PIN, QR scannen, +1 Stempel, Prämie einlösen, neue Karte anlegen. |
| `config.js` | Name, Prämie, Anzahl Stempel, API-URL. |
| `backend/Code.gs` | Google Apps Script (unverändert aus `Stempelkarte`). |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | Home-Bildschirm-App, offline nutzbar. |
| `img/` | Musterfotos (Unsplash). Für echte Kunden durch eigene Fotos ersetzen. |

## Ablauf für den Kunden

1. Im Laden tippt das Personal in `mitarbeiter.html` auf **Neue Karte anlegen** → QR-Code.
2. Der Kunde scannt ihn mit der Handykamera → die Bäckerei-Seite öffnet sich, **seine Karte ist schon drin**.
3. Kunde legt die Seite auf den Home-Bildschirm (Anleitung steht im Bereich „App“). Die Karte kommt mit, weil die Karten-ID in der Adresse steht.
4. Falls die Karte doch fehlt (z. B. iPhone hat sie nicht übernommen): Im Bereich „Stempelkarte“ den **Karten-Code** eintippen, er steht auf der Karte unter „QR-Code und Karten-ID anzeigen“.

## Demo-Modus

Solange in `config.js` noch `DEINE_SCRIPT_ID` steht, läuft die Karte als Demo nur auf dem Gerät:
**Demo-Karte anlegen**, **+1 Stempel (Demo)**, **Prämie einlösen (Demo)**. Gut zum Vorführen beim Kunden.
Sobald die echte Apps-Script-URL eingetragen ist, verschwinden die Demo-Knöpfe und die Karte liest den echten Stand (alle 60 Sekunden und beim Öffnen der App).

## Einrichtung

Genau wie in `Stempelkarte/README.md` (Google Sheet, Apps Script, PIN, GitHub Pages).
Nach Änderungen an Dateien in `sw.js` die Zeile `const CACHE = 'musterkorn-v4'` hochzählen (aktuell v4).

## Noch offen für echte Kunden

- Texte, Preise, Öffnungszeiten, Adresse und Fotos in `index.html` anpassen
- Impressum und Datenschutzerklärung ergänzen
- Vorbestellung ist nur Oberfläche (sendet nichts). Echte Bestellungen bräuchten eine Erweiterung im Backend.

## Stand Backend (eingerichtet am 29.10.2026)

- Google-Tabelle: https://docs.google.com/spreadsheets/d/1a2YQBtahcRiJYhcx68GOoD1cD3FC7RHJy-EQ63tUO5g
- Skript-Editor: https://script.google.com/d/1Is0mgNGhDzY6ecaRwLk8DEzz-qG-c-LmeSrAI5APq-kWw2YRohYZAIki/edit
- Web-App-URL steht in `config.js`.
- Die Personal-PIN steht in den Skripteigenschaften (Zahnrad → Skripteigenschaften → PIN). Sie gehört nicht ins öffentliche Repository.
- **Testphase:** `COOLDOWN_MIN = 0` in `backend/Code.gs`. Vor echtem Betrieb auf `120` setzen und neu bereitstellen
  (Bereitstellen → Bereitstellungen verwalten → Bearbeiten → Version: Neue Version).
- Testkarte `F174E827` (2 Stempel) wurde beim Funktionstest angelegt und kann in der Tabelle gelöscht werden.
- `backend/.clasp.json` verknüpft den Ordner mit dem Skript (für `clasp push`).
