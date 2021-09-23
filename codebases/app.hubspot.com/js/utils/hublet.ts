export var HUBLET_REGEX = /^(local|app)-(.*).hubspot(qa)?.com/;
export function isHublet() {
  return HUBLET_REGEX.test(window.location.hostname);
}
export function getHublet() {
  if (isHublet()) {
    var hubletResult = HUBLET_REGEX.exec(window.location.hostname);
    return hubletResult ? hubletResult[2] : 'na1';
  }

  return 'na1';
}