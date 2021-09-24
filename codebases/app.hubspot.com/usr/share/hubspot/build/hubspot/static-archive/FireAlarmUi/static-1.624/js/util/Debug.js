'use es6';

import Storage from './Storage';
var DEBUG_FLAG = 'FIREALARM_DEBUG';
var storage;

try {
  var localStorage = window && window.localStorage ? window.localStorage : false;
  storage = new Storage(localStorage);
} catch (e) {
  storage = new Storage(false);
}

function debug(message) {
  if (storage.getItem(DEBUG_FLAG)) {
    console.log.apply(console, arguments);
  }
}

export default debug;