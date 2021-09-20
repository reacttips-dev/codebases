'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPlatformName = function getPlatformName() {
  var os = _platform2.default.os.family || '';
  os = os.toLowerCase().replace(/ /g, '');
  if (/\bwin/.test(os)) {
    os = 'windows';
  } else if (/darwin|osx/.test(os)) {
    os = 'osx';
  } else if (/linux|freebsd|sunos|ubuntu|debian|fedora|redhat|suse/.test(os)) {
    os = 'linux';
  } else {
    os = 'other';
  }
  return os;
};

var getCharacter = function getCharacter(event) {
  if (event.which == null) {
    // NOTE: IE
    return String.fromCharCode(event.keyCode);
  } else if (event.which !== 0 && event.charCode !== 0) {
    // NOTE: the rest
    return String.fromCharCode(event.which);
  }
  return null;
};

exports.default = { getPlatformName: getPlatformName, getCharacter: getCharacter };
module.exports = exports['default'];