'use es6'; // UIComponents runs in some environments where window.navigator is undefined.
// See: https://git.hubteam.com/HubSpot/hubspot-book-builder/pull/88

var lowercasedUserAgent = window.navigator ? navigator.userAgent.toLowerCase() : '';
export var isIE11 = function isIE11() {
  return lowercasedUserAgent.includes('trident/');
};
export var isEdge = function isEdge() {
  return lowercasedUserAgent.includes('edge/');
};
export var isMS = function isMS() {
  return isIE11() || isEdge();
};
export var isFirefox = function isFirefox() {
  return lowercasedUserAgent.includes('firefox');
};
export var isSafari = function isSafari() {
  return lowercasedUserAgent.includes('safari/') && !lowercasedUserAgent.includes('chrome/') && !isEdge();
};
export var getEdgeVersion = function getEdgeVersion() {
  var match = lowercasedUserAgent.match(/edge\/(\d+)/);
  return match ? +match[1] : undefined;
};
export var ignoresStyleTagInsertionOrder = function ignoresStyleTagInsertionOrder() {
  return isIE11() || isEdge() && getEdgeVersion() < 17;
};
/**
 * For faking `navigator.userAgent` in tests.
 * @param {string} newUserAgent
 */

export var setUserAgent = function setUserAgent(newUserAgent) {
  lowercasedUserAgent = newUserAgent.toLowerCase();
};