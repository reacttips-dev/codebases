'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import * as DataType from '../../../constants/dataTypes';
import { load } from '../../../dataTypeDefinitions';
import crmSearch from './crm-search/search';
import crossObjectSearch from './cross-object/search';
import engagementSearch from './engagement/search';
import standardSearch from './search';
import commonCrmSearchDefinition from '../../../dataTypeDefinitions/inboundDb/common-crm-search';
import { CRM_SEARCH_DATA_TYPES } from '../common/crm-search-data-types';
var dataTypeToSearchImpl = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DataType.ATTRIBUTION_TOUCH_POINTS, crmSearch), _defineProperty(_ImmutableMap, DataType.CONTACT_CREATE_ATTRIBUTION, crmSearch), _defineProperty(_ImmutableMap, DataType.FEEDBACK_SUBMISSIONS, crmSearch), _defineProperty(_ImmutableMap, DataType.CROSS_OBJECT, crossObjectSearch), _defineProperty(_ImmutableMap, DataType.CALLS, engagementSearch), _defineProperty(_ImmutableMap, DataType.CONVERSATIONS, engagementSearch), _defineProperty(_ImmutableMap, DataType.ENGAGEMENT_EMAILS, engagementSearch), _defineProperty(_ImmutableMap, DataType.FEEDBACK, engagementSearch), _defineProperty(_ImmutableMap, DataType.MEETINGS, engagementSearch), _defineProperty(_ImmutableMap, DataType.NOTES, engagementSearch), _ImmutableMap));
export default function search(config, runtimeOptions) {
  var dataType = config.get('dataType');
  return load(dataType).then(function (moduleDefinition) {
    if (CRM_SEARCH_DATA_TYPES.includes(dataType) || dataType === DataType.LINE_ITEMS || dataType === DataType.FEEDBACK_SUBMISSIONS) {
      return crmSearch(commonCrmSearchDefinition.getInboundSpec(config), config, runtimeOptions);
    }

    return dataTypeToSearchImpl.get(dataType, standardSearch)(moduleDefinition.getInboundSpec(config), config, runtimeOptions);
  }).then(function (dataset) {
    return {
      dataConfig: config,
      dataset: dataset,
      response: undefined
    };
  });
}