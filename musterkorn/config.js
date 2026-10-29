// Hier kommen alle Einstellungen für einen Betrieb hin.
// Für jeden neuen Kunden: Kopie des Ordners, nur diese Datei anpassen.
window.STEMPEL_CONFIG = {
  name: "Bäckerei Musterkorn",        // Name des Betriebs
  subtitle: "Treuekarte",             // Untertitel auf der Karte
  stampsTotal: 10,                    // Anzahl Stempel bis zur Prämie (muss mit backend/Code.gs übereinstimmen)
  reward: "1 Musterkorn-Landbrot",    // Was es bei voller Karte gibt
  apiUrl: "https://script.google.com/macros/s/AKfycbywWfzRQ9fXMOWjNhmTwSuclEp-nCndmig2HbDpTda-yIqzN0R_brsPxxEUbG98jVew/exec", // Apps-Script-Web-App (Bereitstellung "Musterkorn Stempelkarte")
  color: "#b35900",                   // Hauptfarbe
  accent: "#f5f5f7",                  // Hintergrundfarbe
  demoNotice: "Demo – fiktiver Betrieb"  // Hinweis für Demos; bei echten Kunden leer lassen ("")
};
