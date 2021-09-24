'use es6';

import { AGENT_SENDER } from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import { getSenderId, getSenderTypeForCMF } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
var clientIdRegex = /^AGENT-(\d*)$/;
var API_REPUBLISH = 'API-republish';
export var validateMessageClientType = function validateMessageClientType(_ref) {
  var message = _ref.message,
      clientId = _ref.clientId;
  var senderType = getSenderTypeForCMF(message);

  if (senderType === AGENT_SENDER && clientId !== API_REPUBLISH) {
    var clientIdRegexResult = clientIdRegex.exec(clientId);

    if (!clientIdRegexResult || isNaN(parseInt(clientIdRegexResult[1], 10)) || parseInt(clientIdRegexResult[1], 10) !== getSenderId(message)) {
      throw new Error('malformed message');
    }
  }
};