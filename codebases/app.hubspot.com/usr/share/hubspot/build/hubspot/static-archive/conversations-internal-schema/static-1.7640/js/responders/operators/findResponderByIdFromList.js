'use es6';

import { getUserId } from './responderGetters';
export function findResponderByIdFromList(_ref) {
  var responders = _ref.responders,
      responderId = _ref.responderId;
  return responders.find(function (responder) {
    return getUserId(responder) === String(responderId);
  });
}