'use es6'; // TODO: Replace with BE validation https://issues.hubspotcentral.com/browse/CT-3185

import memoize from 'transmute/memoize';
import getIn from 'transmute/getIn';
import { Map as ImmutableMap } from 'immutable';
import { isStarterOrPro } from '../../utils/CallingSalesPro';
import { FAILED } from 'conversations-async-data/async-data/constants/asyncStatuses';
var getMetadata = getIn(['metadata']);
var getValidNumber = getIn(['validNumber']);
var getPossibleNumber = getIn(['possibleNumber']);

var getShouldValidateNumber = function getShouldValidateNumber(phoneNumberPropertyMetadata) {
  return getValidNumber(phoneNumberPropertyMetadata) || getPossibleNumber(phoneNumberPropertyMetadata);
};

var JAPAN_COUNTRY_CODE = 'JP';
export var messageConstants = {
  INVALID: 'numberInvalid',
  SALES_FREE_INVALID: 'numberGeographicallyInvalidSalesFree',
  PERMANENTLY_INVALID: 'geographicallyInvalidNumber',
  CALL_ID_INVALID: 'callerIdInvalid',
  BLACKLISTED_PAID: 'blacklistedPaid',
  BLACKLISTED: 'blacklisted',
  FAILED: 'validationFailed'
};

var isCallingSameCountry = function isCallingSameCountry(validatedToNumber, selectedFromNumber) {
  if (!validatedToNumber || !selectedFromNumber) {
    return true;
  }

  if (!selectedFromNumber.get('countryCode') || !validatedToNumber.get('countryCode')) {
    return true;
  }

  return selectedFromNumber.get('countryCode').toLowerCase() === validatedToNumber.get('countryCode').toLowerCase();
}; // User must upgrade to sales pro / sales starter to call


export var isUpgradeNeeded = function isUpgradeNeeded(validatedToNumber, selectedFromNumber, isInSalesEnterpriseTrial, scopes) {
  var geographicPermission = validatedToNumber.get('geoPermission');
  var callingSameCountry = isCallingSameCountry(validatedToNumber, selectedFromNumber);

  if (isInSalesEnterpriseTrial) {
    return false;
  }

  return geographicPermission === 'SALES_PRO_ONLY' || !isStarterOrPro(scopes) && !callingSameCountry;
};
export var getInvalidPhoneNumberMessage = memoize(function (_ref) {
  var validatedToNumber = _ref.validatedToNumber,
      toNumberStatus = _ref.toNumberStatus,
      selectedFromNumber = _ref.selectedFromNumber,
      ignoreGeoValidation = _ref.ignoreGeoValidation,
      isRegisteringNumber = _ref.isRegisteringNumber,
      isInSalesEnterpriseTrial = _ref.isInSalesEnterpriseTrial,
      isPaidHub = _ref.isPaidHub,
      scopes = _ref.scopes,
      selectedToNumber = _ref.selectedToNumber;

  // selectedToNumber comes from the callees select API and contains light validation
  if (selectedToNumber) {
    var phoneNumberMetadata = getMetadata(selectedToNumber);
    var isPotentiallyValidNumber = getShouldValidateNumber(phoneNumberMetadata);

    if (!isPotentiallyValidNumber) {
      return messageConstants.INVALID;
    }
  }

  if (toNumberStatus === FAILED) {
    return messageConstants.FAILED;
  }

  if (!validatedToNumber) {
    return null;
  }

  var isValidNumber = validatedToNumber && validatedToNumber.get('isValid');

  if (!isValidNumber) {
    return messageConstants.INVALID;
  }

  if (validatedToNumber.get('isBlacklisted')) {
    if (isPaidHub) {
      return messageConstants.BLACKLISTED_PAID;
    }

    return messageConstants.BLACKLISTED;
  }

  if (!ignoreGeoValidation) {
    if (isUpgradeNeeded(validatedToNumber, selectedFromNumber, isInSalesEnterpriseTrial, scopes)) {
      return messageConstants.SALES_FREE_INVALID;
    }

    if (validatedToNumber.get('geoPermission') === 'NOT_ALLOWED') {
      return messageConstants.PERMANENTLY_INVALID;
    }

    if (!isRegisteringNumber && validatedToNumber.get('countryCode') === JAPAN_COUNTRY_CODE) {
      return messageConstants.CALL_ID_INVALID;
    }
  }

  return null;
}, function (args) {
  return ImmutableMap(args).hashCode();
});