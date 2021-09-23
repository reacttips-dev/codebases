'use es6';

import * as InboundDbDataTypes from '../constants/dataTypes/inboundDb';
import * as UnifiedDataTypes from '../constants/dataTypes/unified';
import inboundDb from './inboundDb';
import unified from './unified';
import { has } from '../lib/has';
export var match = function match(config) {
  var dataType = config.get('dataType');
  return InboundDbDataTypes[dataType] || UnifiedDataTypes[dataType];
};
export var retrieve = function retrieve(config, debug) {
  var runtimeOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var dataType = config.get('dataType');

  if (has(InboundDbDataTypes, dataType)) {
    return inboundDb(config, debug, runtimeOptions);
  }

  if (has(UnifiedDataTypes, dataType)) {
    return unified(config, debug, runtimeOptions);
  }

  throw new Error('Mismatch base retrieve');
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = module.exports;
}