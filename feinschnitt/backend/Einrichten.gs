// Einmal im Editor ausführen (Funktion "einrichten" auswählen → Ausführen).
// Legt das Tabellenblatt "Karten" an, setzt die Personal-PIN und fragt die nötigen Google-Berechtigungen ab.
function einrichten() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('PIN')) props.setProperty('PIN', 'HIER_PIN_EINTRAGEN');
  sheet_();
  Logger.log('Fertig. PIN: ' + props.getProperty('PIN'));
}
