'use es6';

import defaultFaviconUrl from 'bender-url!../../resources/default_favicon.ico';
import newNotificationFaviconUrl from 'bender-url!../../resources/fav-icon-red-big.ico';

function getCurrentFavicon() {
  var linkElements = window.top.document.getElementsByTagName('link');
  var currentFavicon = null;
  currentFavicon = Array.from(linkElements).find(function (node) {
    var rel = node.getAttribute('rel');
    return rel === 'rel' || rel === 'shortcut icon';
  });
  return currentFavicon;
}

function createFaviconLink(dotFavicon) {
  var link = window.top.document.createElement('link');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = dotFavicon ? newNotificationFaviconUrl : defaultFaviconUrl;
  return link;
}

export function showFaviconDot(dotFavicon) {
  var currentFavicon = getCurrentFavicon();
  var newFaviconLink = createFaviconLink(dotFavicon);

  if (currentFavicon) {
    window.top.document.head.removeChild(currentFavicon);
  }

  window.top.document.head.appendChild(newFaviconLink);
}