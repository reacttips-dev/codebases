'use es6';

import { getFriendlyOrFormalName, getEmail } from 'conversations-internal-schema/responders/operators/responderGetters';
export var getRespondersNameText = function getRespondersNameText(responders, locale) {
  return responders.map(function (responder) {
    return getFriendlyOrFormalName(responder, locale) || getEmail(responder);
  }).join(', ');
};