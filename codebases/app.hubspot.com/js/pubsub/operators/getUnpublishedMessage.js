'use es6';

import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { SENT } from 'conversations-message-history/common-message-format/constants/statusTypes';
import { buildCommonMessage } from 'conversations-message-history/common-message-format/operators/buildCommonMessage';
import { isCommonMessageFormat } from 'conversations-message-history/common-message-format/operators/cmfComparators';
import { setMessageStatus } from 'conversations-message-history/common-message-format/operators/commonMessageFormatSetters';
import { getType } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
export var getUnpublishedMessage = function getUnpublishedMessage(message) {
  switch (true) {
    case isCommonMessageFormat(message):
      return setMessageStatus(SENT, buildCommonMessage(message));

    default:
      reportError({
        error: new Error("UNRESOLVED_REPUBLISH_MESSAGE: " + getType(message)),
        fingerprint: ['{{ default }}', 'UNRESOLVED_REPUBLISH_MESSAGE']
      });
      return null;
  }
};