# Digitale Stempelkarte (Web-App)

Die Karte läuft im Browser, lässt sich auf den Home-Bildschirm legen und braucht keine App-Store-Anmeldung.
Kosten: 0 € (GitHub Pages und Google Apps Script sind kostenlos).

## Dateien

| Datei | Zweck |
|---|---|
| `config.js` | Name, Anzahl Stempel, Prämie, Farben, API-URL. **Hier wird jeder Kunde angepasst.** |
| `index.html` | Kundenansicht (Stempelstand, QR-Code) |
| `mitarbeiter.html` | Personalansicht (PIN, QR scannen, stempeln, neue Karte) |
| `backend/Code.gs` | Serverlogik in Google Apps Script, Daten in Google Sheet |

## Einrichtung (einmal pro Kunde, ca. 20 Minuten)

**1. Backend anlegen**
1. Auf sheets.google.com ein neues Tabellenblatt erstellen.
2. Menü **Erweiterungen → Apps Script**.
3. Den Inhalt von `backend/Code.gs` einfügen, speichern.
4. Links **Projekteinstellungen (Zahnrad) → Skripteigenschaften → Eigenschaft hinzufügen**: Name `PIN`, Wert deine Personal-PIN (nur Zahlen, z. B. 4–6 Stellen).
5. **Bereitstellen → Neue Bereitstellung → Typ „Web-App“**:
   - Ausführen als: **Ich**
   - Zugriff: **Jeder**
6. Die angezeigte URL (endet auf `/exec`) kopieren.

**2. Konfiguration**
- In `config.js` die URL bei `apiUrl` eintragen.
- Name, Prämie, Farben anpassen.
- `STAMPS_TOTAL` in `backend/Code.gs` muss mit `stampsTotal` in `config.js` übereinstimmen.
- Bei Änderungen am Code: **Bereitstellen → Bereitstellungen verwalten → Bearbeiten → neue Version**, sonst läuft die alte.

**3. GitHub Pages**
1. Neues Repository anlegen (z. B. `stempelkarte-cafe-beispiel`), öffentlich.
2. Alle Dateien dieses Ordners hochladen (ohne Ordner `backend`, der darf mit hoch, schadet nicht).
3. **Settings → Pages → Branch `main`, Ordner `/ (root)`**.
4. Nach ca. einer Minute ist die Seite unter `https://<name>.github.io/<repo>/` erreichbar.

**4. Testen (am Handy)**
1. `.../mitarbeiter.html` öffnen, PIN eingeben.
2. **Neue Karte anlegen** → QR-Code erscheint.
3. Mit einem zweiten Handy den QR-Code scannen oder den Link öffnen → Kundenansicht.
4. Am Personal-Handy scannen → **+1 Stempel**.
5. Prüfen, dass der Kunde den neuen Stand nach spätestens einer Minute sieht.
6. Zweiter Stempel innerhalb von 2 Stunden wird blockiert (gewollt).

## Ablauf im Betrieb

- **Kunde** scannt beim ersten Besuch den QR-Code im Laden (oder bekommt den Link), speichert die Seite auf dem Home-Bildschirm.
- **Beim Besuch** zeigt er die Karte, das Personal scannt sie und tippt **+1 Stempel**.
- **Voll (10 Stempel)** → Prämie einlösen setzt die Karte zurück.

## Wichtige Hinweise

- **Datenschutz:** Gespeichert werden nur eine zufällige Karten-ID, Stempelzahl und Zeitstempel. Keine Namen, keine Telefonnummer. Trotzdem braucht der Kunde eine Datenschutzerklärung (Muster kann ich erstellen).
- **Impressum:** Für echte Betriebe Pflicht auf der Website, nicht auf der Stempelkarte selbst.
- **Demo-Kennzeichnung:** In `config.js` steht `demoNotice`. Bei Demos stehen lassen, bei echten Kunden auf `""` setzen.
- **PIN-Sicherheit:** Die PIN prüft das Backend. Bei Verlust einfach in den Skripteigenschaften ändern.
- **Kein Wallet:** Die Karte liegt als Web-App auf dem Home-Bildschirm, nicht in Apple oder Google Wallet. Das ist Stand der Demo ausreichend. Wallet-Pässe kommen als Ausbaustufe, wenn ein Kunde sie will.
- **Kamera:** Der Scanner braucht HTTPS (bei GitHub Pages automatisch) und die Kamera-Erlaubnis im Browser.
