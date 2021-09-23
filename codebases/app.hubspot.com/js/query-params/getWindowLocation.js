'use es6';

import Url from 'hubspot.urlinator.Url';
export var getWindowLocation = function getWindowLocation() {
  return new Url(window.location.href);
};