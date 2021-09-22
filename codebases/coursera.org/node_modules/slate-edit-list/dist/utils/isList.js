'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('slate');

/**
 * True if the node is a list container
 */
function isList(opts, node) {
  return opts.types.includes(node.type);
}
exports.default = isList;