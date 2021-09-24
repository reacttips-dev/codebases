'use es6';

import Sanitize from 'sanitize'; // For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js

export var buildSanitizer = function buildSanitizer(config) {
  return new Sanitize(config);
};