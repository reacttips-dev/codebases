'use strict';

var unescape = require('./unescape');

function safeson (data, spaces) {
  return JSON.stringify(data, null, spaces)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decode (data) {
  return JSON.parse(unescape(data));
}

module.exports = safeson;
safeson.decode = decode;
