'use es6';

import isValidI18nKey from 'I18n/utils/isValidI18nKey';
import I18n from 'I18n';
import getIn from 'transmute/getIn';
var ASSOCIATION_LIMIT_EXCEEDED = 'ASSOCIATION_LIMIT_EXCEEDED';
var ASSOCIATION_LIMIT = 10000;
export default function getStartCallFailedReasonMessage() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      hasCallingFields = _ref.hasCallingFields,
      error = _ref.error;

  var associationFailures;

  try {
    associationFailures = JSON.parse(getIn(['context', 'associationFailures'], error));
  } catch (_unused) {
    associationFailures = getIn(['responseJSON', 'errorTokens', 'associationFailures'], error);
  }

  var isAssociationLimitFailure = associationFailures && getIn(['0', 'failReason'], associationFailures) === ASSOCIATION_LIMIT_EXCEEDED;
  var message = I18n.text('calling-communicator-ui.genericError.genericMsg');

  if (hasCallingFields && !hasCallingFields.hasSelectedFromNumber) {
    message = I18n.text('calling-communicator-ui.genericError.fromNumber');
  } else if (hasCallingFields && !hasCallingFields.hasSelectedToNumber) {
    message = I18n.text('calling-communicator-ui.genericError.toNumber');
  } else if (hasCallingFields && hasCallingFields.isMissingRequiredThreadId) {
    message = I18n.text("calling-communicator-ui.subCategoryErrors.twilio-create-call-error.MISSING_THREAD_ID");
  } else if (isAssociationLimitFailure) {
    message = I18n.text('calling-communicator-ui.initialLogEngagement.failedMsdAssociationsLimit', {
      limit: ASSOCIATION_LIMIT
    });
  } else if (error && error.subCategory && isValidI18nKey("calling-communicator-ui.subCategoryErrors." + error.subCategory)) {
    message = I18n.text("calling-communicator-ui.subCategoryErrors." + error.subCategory);
  } else if (error) {
    message = error.isCallMyPhone ? I18n.text('calling-communicator-ui.initialLogEngagement.callMyPhoneFailed') : I18n.text('calling-communicator-ui.initialLogEngagement.failedMsg');
  }

  return message;
}