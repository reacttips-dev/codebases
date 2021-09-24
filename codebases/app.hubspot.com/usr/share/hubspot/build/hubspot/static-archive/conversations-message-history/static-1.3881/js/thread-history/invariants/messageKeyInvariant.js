'use es6';

import invariant from 'react-utils/invariant';
export var messageKeyInvariant = function messageKeyInvariant(messageKey) {
  return invariant(typeof messageKey === 'string', 'Expected messageKey to be a `String` not a `%s`', typeof messageKey);
};