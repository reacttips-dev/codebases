'use es6';

import * as ObjectTypes from '../constants/ObjectTypes';
import * as ObjectTypeIds from '../constants/ObjectTypeIds';
import I18n from 'I18n';
import memoize from 'transmute/memoize';
var CONTACT = ObjectTypes.CONTACT,
    COMPANY = ObjectTypes.COMPANY,
    DEAL = ObjectTypes.DEAL,
    TICKET = ObjectTypes.TICKET;
var CONTACT_TYPE_ID = ObjectTypeIds.CONTACT_TYPE_ID,
    COMPANY_TYPE_ID = ObjectTypeIds.COMPANY_TYPE_ID,
    DEAL_TYPE_ID = ObjectTypeIds.DEAL_TYPE_ID,
    TICKET_TYPE_ID = ObjectTypeIds.TICKET_TYPE_ID;
var getObjectTranslationKeyUnknownNumber = memoize(function (objectType, isCapitalized) {
  if (isCapitalized) {
    switch (objectType) {
      case CONTACT:
      case CONTACT_TYPE_ID:
        return 'customerDataObjects.objectNames.unknownNumber.capitalized.CONTACT';

      case COMPANY:
      case COMPANY_TYPE_ID:
        return 'customerDataObjects.objectNames.unknownNumber.capitalized.COMPANY';

      case DEAL:
      case DEAL_TYPE_ID:
        return 'customerDataObjects.objectNames.unknownNumber.capitalized.DEAL';

      case TICKET:
      case TICKET_TYPE_ID:
        return 'customerDataObjects.objectNames.unknownNumber.capitalized.TICKET';

      default:
        return 'customerDataObjects.objectNames.unknownNumber.capitalized.default';
    }
  }

  switch (objectType) {
    case CONTACT:
    case CONTACT_TYPE_ID:
      return 'customerDataObjects.objectNames.unknownNumber.CONTACT';

    case COMPANY:
    case COMPANY_TYPE_ID:
      return 'customerDataObjects.objectNames.unknownNumber.COMPANY';

    case DEAL:
    case DEAL_TYPE_ID:
      return 'customerDataObjects.objectNames.unknownNumber.DEAL';

    case TICKET:
    case TICKET_TYPE_ID:
      return 'customerDataObjects.objectNames.unknownNumber.TICKET';

    default:
      return 'customerDataObjects.objectNames.unknownNumber.default';
  }
});
var getObjectTranslationKey = memoize(function (objectType, isCapitalized) {
  if (isCapitalized) {
    switch (objectType) {
      case CONTACT:
      case CONTACT_TYPE_ID:
        return 'customerDataObjects.objectNames.capitalized.CONTACT';

      case COMPANY:
      case COMPANY_TYPE_ID:
        return 'customerDataObjects.objectNames.capitalized.COMPANY';

      case DEAL:
      case DEAL_TYPE_ID:
        return 'customerDataObjects.objectNames.capitalized.DEAL';

      case TICKET:
      case TICKET_TYPE_ID:
        return 'customerDataObjects.objectNames.capitalized.TICKET';

      default:
        return 'customerDataObjects.objectNames.capitalized.default';
    }
  }

  switch (objectType) {
    case CONTACT:
    case CONTACT_TYPE_ID:
      return 'customerDataObjects.objectNames.CONTACT';

    case COMPANY:
    case COMPANY_TYPE_ID:
      return 'customerDataObjects.objectNames.COMPANY';

    case DEAL:
    case DEAL_TYPE_ID:
      return 'customerDataObjects.objectNames.DEAL';

    case TICKET:
    case TICKET_TYPE_ID:
      return 'customerDataObjects.objectNames.TICKET';

    default:
      return 'customerDataObjects.objectNames.default';
  }
}); // used when we don't know the number of objects we're referring to but want it to be plural, prefer using the count if able because some langs change plurals depending on the count
// for more info see discussion here: https://git.hubteam.com/HubSpot/customer-data-objects/pull/80#discussion_r831216

export function translateObjectNameUnknownNumber(objectType) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      isCapitalized = _ref.isCapitalized;

  var translationKey = getObjectTranslationKeyUnknownNumber(objectType, isCapitalized);
  return translationKey ? I18n.text(getObjectTranslationKeyUnknownNumber(objectType, isCapitalized)) : '';
}
export function translateObjectName(objectType) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      count = _ref2.count,
      isCapitalized = _ref2.isCapitalized;

  var translationKey = getObjectTranslationKey(objectType, isCapitalized);
  return translationKey ? I18n.text(getObjectTranslationKey(objectType, isCapitalized), {
    count: count != null ? count : 1
  }) : '';
}