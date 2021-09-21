'use strict';

module.exports = function lowercase (string) {
  return typeof string === 'string' ? string.toLowerCase() : string;
};
