'use es6';

import invariant from 'react-utils/invariant';
import { numberIdInvariant } from 'conversations-async-data/indexed-async-data/invariants/numberIdInvariant';
import { getId, getType } from './responderKeyGetters';
export var responderKeyInvariant = function responderKeyInvariant(responderKey) {
  var id = getId(responderKey);
  var type = getType(responderKey);
  invariant(!!id, 'Responder ID must be set in the key map');
  numberIdInvariant(id);
  invariant(!!type, 'Responder type must be set in the key map');
};