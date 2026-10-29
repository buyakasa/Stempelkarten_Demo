// Hier kommen alle Einstellungen für einen Betrieb hin.
// Für jeden neuen Kunden: Kopie des Ordners, nur diese Datei anpassen.
window.STEMPEL_CONFIG = {
  name: "Salon Feinschnitt",        // Name des Betriebs
  subtitle: "Treuekarte",             // Untertitel auf der Karte
  stampsTotal: 10,                    // Anzahl Stempel bis zur Prämie (muss mit backend/Code.gs übereinstimmen)
  reward: "1 Pflege-Kur",    // Was es bei voller Karte gibt
  apiUrl: "https://script.google.com/macros/s/AKfycbxm6b8nEk2y9uYOLPYvjG9wWTsTX8qSbpIKfnDLv8fvxPgdkIktUcN0wNCdG8yuj3Sa/exec", // Apps-Script-Web-App (Bereitstellung "Feinschnitt Stempelkarte")
  color: "#8c2f5f",                   // Hauptfarbe
  accent: "#f5f5f7",                  // Hintergrundfarbe
  demoNotice: "Demo – fiktiver Betrieb"  // Hinweis für Demos; bei echten Kunden leer lassen ("")
};
