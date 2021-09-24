'use es6';

import { defaultNamespace } from './getSuperstoreClient';
export var getSuperstoreKey = function getSuperstoreKey(keyPart) {
  return defaultNamespace + ":" + keyPart;
};