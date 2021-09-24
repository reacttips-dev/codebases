'use es6';

var ZORSE_IS_LOADED = false;

var getIsZorseLoaded = function getIsZorseLoaded() {
  if (ZORSE_IS_LOADED) {
    return true;
  }

  ZORSE_IS_LOADED = window.top.document.documentElement.classList.contains('zorse');
  return ZORSE_IS_LOADED;
};

export function openDocument(documentUrl) {
  if (getIsZorseLoaded()) {
    // eslint-disable-next-line hubspot-dev/hubspot-is-special
    return window.top.hubspot.zorse.openHelpWidget({
      url: documentUrl
    });
  } else {
    return window.top.open(documentUrl, '_blank');
  }
}
export function createTicket() {
  if (getIsZorseLoaded()) {
    // eslint-disable-next-line hubspot-dev/hubspot-is-special
    return window.top.hubspot.zorse.openHelpWidget({
      create: true
    });
  }

  return null;
}