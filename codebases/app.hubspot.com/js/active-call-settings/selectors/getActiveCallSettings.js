'use es6';

import get from 'transmute/get';
import { getData, getStatus } from 'conversations-async-data/async-data/operators/getters';
import { getIsTwilioBasedCallProvider, getIsProviderHubSpot } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { READY } from 'calling-internal-common/widget-status/constants/CallWidgetStates';
import getHubSettingsFromState from '../../hub-settings/selectors/getHubSettingsFromState';
import { createSelector } from 'reselect';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import { SUCCEEDED } from 'conversations-async-data/async-data/constants/asyncStatuses';
import { isStarted, isUninitialized } from 'conversations-async-data/async-data/operators/statusComparators';
import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getEntry';
import { getRequiresTwoPartyConsent } from 'calling-settings-ui-library/records/phone-number/getters';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import { getScopesFromState } from '../../Auth/selectors/authSelectors';
import { getInvalidPhoneNumberMessage } from 'calling-settings-ui-library/number-registration/utils/InvalidPhoneNumberMessage';
import { getSelectedCallMethod, getClientStatus, getToNumberIdentifier, getSelectedFromNumber, getSelectedConnectFromNumber, getOwnerId, getSubjectId, getObjectTypeId, getThreadId } from '../records/getters';
import { getIsPaidHubFromState, getIsSalesEnterpriseTrialFromState } from '../../settings-omnibus/selectors/getPortalSettingsFromState';
import { getPhoneNumberProperties, getPropertyFromCallees, getObjectId as getCallableObjectId, getObjectTypeId as getCallableObjectTypeId, getPropertyName, getValue } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { getCallableObjectListFromState, getCallableObjectsFromState, getCalleesDataFromState } from '../../callees/selectors/calleesSelectors';
import { getCalleeToUpdateFromState } from '../../callees/selectors/addingPropertySelectors';
import { getProviderSupportsCurrentObjectType } from '../../calling-providers/operators/getProviderSupportsCurrentObjectType';
import { getFormattedName } from '../../callee-properties/operators/propertyValueGetters';
import { getAdditionalProperties } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
export var getActiveCallSettingsFromState = get('activeCallSettings');
export var getPhoneNumbersByPropertyFromState = get('phoneNumbersByProperty');
export var getSelectedCallMethodFromState = createSelector([getActiveCallSettingsFromState], getSelectedCallMethod);
export var getToNumberIdentifierFromState = createSelector([getActiveCallSettingsFromState], getToNumberIdentifier);
export var getToNumberIdentifierObjectIdFromState = createSelector([getActiveCallSettingsFromState], getCallableObjectId);
export var getSelectedCallableObjectFromState = createSelector([getToNumberIdentifierFromState, getCallableObjectsFromState], function (toNumberIdentifier, callableObjects) {
  if (!toNumberIdentifier || !callableObjects) {
    return null;
  }

  return callableObjects.find(function (callableObject) {
    return getCallableObjectId(callableObject) === toNumberIdentifier.get('objectId') && getCallableObjectTypeId(callableObject) === toNumberIdentifier.get('objectTypeId');
  }) || null;
});
export var getNameFromSelectedCallableObject = createSelector([getSelectedCallableObjectFromState], function (selectedCallableObject) {
  var additionalProperties = getAdditionalProperties(selectedCallableObject);
  return getFormattedName(additionalProperties);
});
export var getSelectedObjectToEditFromState = createSelector([getCalleeToUpdateFromState, getCallableObjectListFromState], function (calleeToUpdate, objectList) {
  if (calleeToUpdate) {
    if (getPhoneNumberProperties(calleeToUpdate)) {
      return calleeToUpdate;
    } else {
      return objectList.find(function (callableObject) {
        return getCallableObjectId(callableObject) === getCallableObjectId(calleeToUpdate) && getCallableObjectTypeId(callableObject) === calleeToUpdate.get('objectTypeId');
      });
    }
  }

  return null;
});

var getNumberFromProps = function getNumberFromProps(_, props) {
  return get('number', props);
};

export var getNumberPropertyFromState = createSelector([getCallableObjectListFromState, getNumberFromProps], function (callees, number) {
  var objectId = number.get('objectId');
  var objectTypeId = number.get('objectTypeId');
  var propertyName = number.get('propertyName');
  return getPropertyFromCallees({
    objectTypeId: objectTypeId,
    objectId: objectId,
    propertyName: propertyName
  }, callees);
});
export var getSelectedToNumberFromState = createSelector([getToNumberIdentifierFromState, getCalleesDataFromState], function (toNumberIdentifier, callees) {
  if (toNumberIdentifier) {
    var objectId = toNumberIdentifier.get('objectId');
    var objectTypeId = toNumberIdentifier.get('objectTypeId');
    var propertyName = toNumberIdentifier.get('propertyName');
    return getPropertyFromCallees({
      objectTypeId: objectTypeId,
      objectId: objectId,
      propertyName: propertyName
    }, callees) || null;
  }

  return null;
});
export var getSelectedPhoneNumberValueFromState = createSelector([getSelectedCallableObjectFromState, getToNumberIdentifierFromState], function (callableObject, toNumberIdentifier) {
  if (!callableObject || !toNumberIdentifier) {
    return null;
  }

  var propertyName = toNumberIdentifier.get('propertyName');
  var phoneNumberProperties = getPhoneNumberProperties(callableObject);

  if (phoneNumberProperties) {
    var propertyDefinition = phoneNumberProperties.find(function (phoneNumberProperty) {
      return getPropertyName(phoneNumberProperty) === propertyName;
    });

    if (propertyDefinition) {
      return getValue(propertyDefinition) || null;
    }
  }

  return null;
});
export var getSelectedFromNumberFromState = createSelector([getActiveCallSettingsFromState, getSelectedCallProviderFromState], function (activeCallSettings, selectedCallProvider) {
  var isUsingTwilioConnect = getIsProviderTwilioConnect(selectedCallProvider);

  if (isUsingTwilioConnect) {
    return getSelectedConnectFromNumber(activeCallSettings);
  }

  return getSelectedFromNumber(activeCallSettings);
});
export var getClientStatusFromState = createSelector([getActiveCallSettingsFromState], getClientStatus); // HubSpot specific see: getIsCallProviderReady.js for external statuses

export var getIsClientReady = createSelector([getClientStatusFromState, getSelectedCallProviderFromState], function (clientStatus, callProvider) {
  if (getIsTwilioBasedCallProvider(callProvider)) {
    return clientStatus === READY;
  }

  return false;
});
export var getOwnerIdFromState = createSelector([getActiveCallSettingsFromState], getOwnerId);
export var getSubjectIdFromState = createSelector([getActiveCallSettingsFromState], getSubjectId);
export var getObjectTypeIdFromState = createSelector([getActiveCallSettingsFromState], getObjectTypeId);
export var getIsQueueTaskFromState = createSelector([getActiveCallSettingsFromState], function (activeCallSettings) {
  return activeCallSettings.get('isQueueTask');
});
export var isWidgetReadyToStartCalls = createSelector([getHubSettingsFromState, getPhoneNumbersByPropertyFromState], function (hubSettings) {
  return hubSettings.status === SUCCEEDED;
});
export var getValidatedNumbers = get('validatedNumbers');
export var getValidatedToNumberFromState = createSelector([getValidatedNumbers, getToNumberIdentifierFromState], function (validatedNumbers, toNumberIdentifier) {
  if (!toNumberIdentifier) {
    return null;
  }

  var validatedNumberKey = toNumberIdentifier.toKey();
  var validatedNumberEntry = getEntry(validatedNumberKey, validatedNumbers);
  return validatedNumberEntry || null;
});
export var getValidatedToNumberIsLoadingFromState = createSelector([getValidatedToNumberFromState], function (validatedToNumber) {
  return isUninitialized(validatedToNumber) || isStarted(validatedToNumber);
});
export var getInvalidPhoneNumberMessageFromState = createSelector([getValidatedToNumberFromState, getSelectedFromNumberFromState, getSelectedCallProviderFromState, getIsSalesEnterpriseTrialFromState, getIsPaidHubFromState, getScopesFromState, getSelectedToNumberFromState], function (validatedToNumber, selectedFromNumber, selectedCallProvider, isInSalesEnterpriseTrial, isPaidHub, scopes, selectedToNumber) {
  return getInvalidPhoneNumberMessage({
    validatedToNumber: getData(validatedToNumber),
    toNumberStatus: getStatus(validatedToNumber),
    selectedFromNumber: selectedFromNumber,
    ignoreGeoValidation: !getIsProviderHubSpot(selectedCallProvider),
    isRegisteringNumber: false,
    isInSalesEnterpriseTrial: isInSalesEnterpriseTrial,
    isPaidHub: isPaidHub,
    scopes: scopes,
    selectedToNumber: selectedToNumber
  });
});
export var getRequiresTwoPartyConsentFromState = createSelector([getValidatedToNumberFromState], function (validatedToNumber) {
  var validatedToNumberData = getData(validatedToNumber);
  return getRequiresTwoPartyConsent(validatedToNumberData);
});
export var getAppIdentifierFromState = createSelector([getActiveCallSettingsFromState], get('appIdentifier'));
export var getProviderSupportsCurrentObjectTypeFromState = createSelector([getSelectedCallProviderFromState, getObjectTypeIdFromState], function (selectedCallProvider, objectTypeId) {
  return getProviderSupportsCurrentObjectType({
    selectedCallProvider: selectedCallProvider,
    objectTypeId: objectTypeId
  });
});
export var getThreadIdFromState = createSelector([getActiveCallSettingsFromState], getThreadId);