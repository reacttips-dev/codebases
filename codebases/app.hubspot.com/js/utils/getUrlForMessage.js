'use es6';

import Url from 'hubspot.urlinator.Url';
export var getUrlForMessage = function getUrlForMessage() {
  var url = window.location !== window.parent.location ? document.referrer : document.origin;
  var parsedUrl = new Url(url);
  return parsedUrl.hostplus;
};