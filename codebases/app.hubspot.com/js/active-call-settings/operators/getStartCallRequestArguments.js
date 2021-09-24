'use es6';

import { getRequiresTwoPartyConsent } from 'calling-settings-ui-library/records/phone-number/getters';
import get from 'transmute/get';
import { getAccountSid, getAccountType } from 'calling-client-interface/records/token/getters';
import { getSelectedConnectFromNumber, getSelectedFromNumber, getSubjectId } from '../records/getters';
import { getObjectId, getObjectTypeId } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
export function getStartCallRequestArguments(_ref) {
  var activeCallSettings = _ref.activeCallSettings,
      defaultAssociationsData = _ref.defaultAssociationsData,
      isUsingTwilioConnect = _ref.isUsingTwilioConnect,
      validatedToNumber = _ref.validatedToNumber,
      recordCall = _ref.recordCall,
      isGDPRBypassed = _ref.isGDPRBypassed,
      token = _ref.token,
      appIdentifier = _ref.appIdentifier,
      ownerId = _ref.ownerId,
      callableObject = _ref.callableObject,
      _ref$isUngatedForCall = _ref.isUngatedForCallMyPhoneOmnibus,
      isUngatedForCallMyPhoneOmnibus = _ref$isUngatedForCall === void 0 ? false : _ref$isUngatedForCall,
      threadId = _ref.threadId;
  var selectedFromNumber = isUsingTwilioConnect ? getSelectedConnectFromNumber(activeCallSettings) : getSelectedFromNumber(activeCallSettings);
  var fromNumber = get('friendlyName', selectedFromNumber);
  return {
    accountSid: getAccountSid(token),
    accountType: getAccountType(token),
    associations: defaultAssociationsData,
    fromNumber: fromNumber,
    initialIncludeRecording: recordCall && !getRequiresTwoPartyConsent(validatedToNumber),
    isUsingTwilioConnect: isUsingTwilioConnect,
    source: appIdentifier,
    subjectId: getSubjectId(activeCallSettings),
    subscriptionOverride: isGDPRBypassed,
    toNumber: validatedToNumber.toNumberString,
    twilioClientOptions: {
      recordCall: recordCall,
      token: token
    },
    ownerId: ownerId,
    calleeId: getObjectId(callableObject),
    calleeObjectTypeId: getObjectTypeId(callableObject),
    isUngatedForCallMyPhoneOmnibus: isUngatedForCallMyPhoneOmnibus,
    threadId: threadId
  };
}