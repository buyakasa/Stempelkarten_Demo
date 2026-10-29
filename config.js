// Hier kommen alle Einstellungen für einen Betrieb hin.
// Für jeden neuen Kunden: Kopie des Ordners, nur diese Datei anpassen.
window.STEMPEL_CONFIG = {
  name: "Café Beispiel",              // Name des Betriebs
  subtitle: "Treuekarte",             // Untertitel auf der Karte
  stampsTotal: 10,                    // Anzahl Stempel bis zur Prämie (muss mit backend/Code.gs übereinstimmen)
  reward: "1 Kaffee gratis",          // Was es bei voller Karte gibt
  apiUrl: "https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec", // URL nach dem Bereitstellen eintragen
  color: "#8B5A2B",                   // Hauptfarbe
  accent: "#F5E6CC",                  // Hintergrundfarbe
  demoNotice: "Demo – fiktiver Betrieb"  // Hinweis für Demos; bei echten Kunden leer lassen ("")
};
