'use es6';

var ZORSE_IS_LOADED = false;

var getIsZorseLoaded = function getIsZorseLoaded() {
  if (ZORSE_IS_LOADED) {
    return true;
  }

  ZORSE_IS_LOADED = document.documentElement.classList.contains('zorse');
  return ZORSE_IS_LOADED;
};

export function openDocument(documentUrl) {
  if (getIsZorseLoaded()) {
    // eslint-disable-next-line hubspot-dev/hubspot-is-special
    return window.hubspot.zorse.openHelpWidget({
      url: documentUrl
    });
  } else {
    return window.open(documentUrl, '_blank');
  }
}