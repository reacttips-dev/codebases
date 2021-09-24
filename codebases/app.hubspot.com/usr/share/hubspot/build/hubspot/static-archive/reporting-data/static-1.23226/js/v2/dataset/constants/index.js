'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import * as DataTypes from '../../../constants/dataTypes';
import * as UnifiedDataTypes from '../../../constants/dataTypes/unified';
export var LINKS_FIELD = '$links';
export var getIsAttributionType = function getIsAttributionType(dataType) {
  return [DataTypes.ATTRIBUTION_TOUCH_POINTS, DataTypes.CONTACT_CREATE_ATTRIBUTION, DataTypes.DEAL_CREATE_ATTRIBUTION].includes(dataType);
};
export var idFieldMap = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DataTypes.CONTACTS, 'vid'), _defineProperty(_ImmutableMap, DataTypes.COMPANIES, 'company-id'), _defineProperty(_ImmutableMap, DataTypes.DEALS, 'dealId'), _defineProperty(_ImmutableMap, DataTypes.ENGAGEMENT, 'engagement.id'), _defineProperty(_ImmutableMap, DataTypes.ENGAGEMENTS, 'hs_unique_id'), _defineProperty(_ImmutableMap, DataTypes.TICKETS, 'hs_ticket_id'), _defineProperty(_ImmutableMap, DataTypes.LINE_ITEMS, 'objectId'), _defineProperty(_ImmutableMap, DataTypes.EMAIL, 'id'), _ImmutableMap));
export var getIdColumnFromDataType = function getIdColumnFromDataType(dataType) {
  if (UnifiedDataTypes[dataType]) {
    return 'breakdown';
  }

  return idFieldMap.get(dataType);
};