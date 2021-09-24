'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { DEAL_STAGE, OWNER, TICKET_STAGE } from 'customer-data-objects/property/ExternalOptionTypes';
import { EMAIL_CAMPAIGN_URL, SITE_CONTENT } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { List } from 'immutable';
import { __ANY_LINK, __ANY_PAGE } from 'customer-data-filters/converters/listSegClassic/ListSegConstants';
import { getAllClosedOption } from 'customer-data-objects/ticket/TicketStageIdOptions';
import { getAllClosedWonOption } from 'customer-data-objects/deal/DealStageIdOptions';
import { getMeOption } from 'customer-data-objects/owners/OwnerIdOptions';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import once from 'transmute/once';
import unescapedText from 'I18n/utils/unescapedText';
var getSpecialOptionsByReferenceType = once(function () {
  var _ref;

  return _ref = {}, _defineProperty(_ref, OWNER, function () {
    return List.of(getMeOption());
  }), _defineProperty(_ref, DEAL_STAGE, function () {
    return List.of(getAllClosedWonOption());
  }), _defineProperty(_ref, TICKET_STAGE, function () {
    return List.of(getAllClosedOption());
  }), _defineProperty(_ref, EMAIL_CAMPAIGN_URL, function () {
    return List.of(PropertyOptionRecord({
      label: unescapedText('customerDataFilters.FilterEditor.specialOptionValues.anyLink'),
      value: __ANY_LINK
    }));
  }), _defineProperty(_ref, SITE_CONTENT, function () {
    return List.of(PropertyOptionRecord({
      label: unescapedText('customerDataFilters.FilterEditor.specialOptionValues.anyPage'),
      value: __ANY_PAGE
    }));
  }), _ref;
});
export default getSpecialOptionsByReferenceType;