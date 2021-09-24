'use es6';

import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
/**
 *
 * @param  {...String} gates
 * @deprecated Do not use directly. Prefer useHasAllGates.
 */

export var hasAllGates = function hasAllGates() {
  for (var _len = arguments.length, gates = new Array(_len), _key = 0; _key < _len; _key++) {
    gates[_key] = arguments[_key];
  }

  return gates.every(function (gate) {
    return IsUngatedStore.get(gate) || false;
  });
};