'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createSelector } from 'reselect';
import I18n from 'I18n';
import { CALL, DISCOVERY, BDR_CONTACT_ACTIVITY_TYPES, SERVICE_ENGINEER_ACTIVITY_TYPES, SALES_ENGINEER_ACTIVITY_TYPES, DEAL_DEFAULT_ACTIVITY_TYPES, AP_ACTIVITY_TYPES, BET_ACTIVITY_TYPE_VALUES, BET_ACTIVITY_TYPE_GROUPS_VALUES } from '../constants/BETActivityTypes';
import { getObjectTypeIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getScopesFromState } from '../../Auth/selectors/authSelectors';
import { getIsScopedForBETISCActivityDetails } from '../../Auth/selectors/scopes';
import { CONNECTED } from '../constants/CallOutcomeDispositions';
import { getEngagementDispositionFromState, getEngagementActivityTypeFromState } from '../../engagement/selectors/getEngagement';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';

var ObjectEntries = // eslint-disable-next-line no-restricted-properties
Object.entries || function (obj) {
  var ownProps = Object.keys(obj);
  var i = ownProps.length;
  var resArray = new Array(i); // preallocate the Array

  while (i--) {
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  }

  return resArray;
};

function getActivityTypesByRole(scopes) {
  var _ref5;

  if (scopes.includes('bet-activity-types-services-engineer')) {
    var _ref;

    return _ref = {}, _defineProperty(_ref, CONTACT_TYPE_ID, SERVICE_ENGINEER_ACTIVITY_TYPES), _defineProperty(_ref, COMPANY_TYPE_ID, SERVICE_ENGINEER_ACTIVITY_TYPES), _defineProperty(_ref, DEAL_TYPE_ID, DEAL_DEFAULT_ACTIVITY_TYPES), _ref;
  }

  if (scopes.includes('bet-activity-types-sales-engineer')) {
    var _ref2;

    return _ref2 = {}, _defineProperty(_ref2, CONTACT_TYPE_ID, SALES_ENGINEER_ACTIVITY_TYPES), _defineProperty(_ref2, COMPANY_TYPE_ID, SALES_ENGINEER_ACTIVITY_TYPES), _defineProperty(_ref2, DEAL_TYPE_ID, SALES_ENGINEER_ACTIVITY_TYPES), _ref2;
  }

  if (scopes.includes('bet-activity-type-partner-rep')) {
    var _ref3;

    return _ref3 = {}, _defineProperty(_ref3, CONTACT_TYPE_ID, AP_ACTIVITY_TYPES), _defineProperty(_ref3, COMPANY_TYPE_ID, AP_ACTIVITY_TYPES), _defineProperty(_ref3, DEAL_TYPE_ID, DEAL_DEFAULT_ACTIVITY_TYPES), _ref3;
  }

  if (scopes.includes('bet-bdr-log-activity-call-details')) {
    var _ref4;

    return _ref4 = {}, _defineProperty(_ref4, CONTACT_TYPE_ID, BDR_CONTACT_ACTIVITY_TYPES), _defineProperty(_ref4, COMPANY_TYPE_ID, [CALL]), _defineProperty(_ref4, DEAL_TYPE_ID, DEAL_DEFAULT_ACTIVITY_TYPES), _ref4;
  }

  return _ref5 = {}, _defineProperty(_ref5, CONTACT_TYPE_ID, [CALL, DISCOVERY]), _defineProperty(_ref5, COMPANY_TYPE_ID, [CALL]), _defineProperty(_ref5, DEAL_TYPE_ID, DEAL_DEFAULT_ACTIVITY_TYPES), _ref5;
}

function fromKeys(options) {
  return options.map(function (option) {
    return {
      text: I18n.text("bet.activityType.types." + option),
      value: BET_ACTIVITY_TYPE_VALUES[option] || option
    };
  });
}

function fromGroupedKeys(options, groupText, groupValue) {
  return options.map(function (option) {
    var text = I18n.text("bet.activityType.types." + option);
    var value = BET_ACTIVITY_TYPE_VALUES[option] || option;
    return {
      text: groupText + " - " + text,
      value: groupValue + " - " + value,
      dropdownText: text
    };
  });
}

export var getBETActivityTypesByObjectTypeFromState = createSelector([getObjectTypeIdFromState, getScopesFromState], function (objectTypeId, scopes) {
  var activityTypes = getActivityTypesByRole(scopes)[objectTypeId];

  if (Array.isArray(activityTypes)) {
    return fromKeys(activityTypes);
  }

  return ObjectEntries(activityTypes).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        group = _ref7[0],
        options = _ref7[1];

    var groupText = I18n.text("bet.activityType.groups." + group);
    var groupValue = BET_ACTIVITY_TYPE_GROUPS_VALUES[group];
    return {
      text: groupText,
      value: groupValue,
      options: fromGroupedKeys(options, groupText, groupValue)
    };
  });
});
export var getBETCallDetailsRequiredFromState = createSelector([getIsScopedForBETISCActivityDetails, getObjectTypeIdFromState, getEngagementDispositionFromState, getEngagementActivityTypeFromState], function (hasBETISCScope, objectTypeId, disposition, activityType) {
  if (!hasBETISCScope) return false;
  var callDetailsRequired = objectTypeId === CONTACT_TYPE_ID && disposition === CONNECTED;
  var callDetailsSelected = !!activityType;
  return callDetailsRequired ? !callDetailsSelected : false;
});