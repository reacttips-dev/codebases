'use es6';

export var domReady = function domReady(callback) {
  if (['interactive', 'complete'].includes(document.readyState)) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};