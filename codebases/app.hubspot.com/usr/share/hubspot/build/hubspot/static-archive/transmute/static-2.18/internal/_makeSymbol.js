'use es6';

import uniqueId from '../uniqueId';
export default function _makeSymbol(name) {
  return typeof Symbol === 'function' ? Symbol(name) : uniqueId(name);
}