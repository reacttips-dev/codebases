'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyBindingFn = keyBindingFn;

var _draftJs = require('draft-js');

/**
 * Handle default key bindings.
 *
 * @param {Event} event
 * @return {String} defaultCommand
 */
function keyBindingFn(event) {
  return (0, _draftJs.getDefaultKeyBinding)(event);
}