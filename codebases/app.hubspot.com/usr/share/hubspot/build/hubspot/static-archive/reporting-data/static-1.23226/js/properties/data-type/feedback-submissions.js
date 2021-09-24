'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List } from 'immutable';
import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import { FEEDBACK_SUBMISSIONS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
import { mergeProperties } from '../mergeProperties';
import prefix from '../../lib/prefix';
import { ENUMERATION } from '../../constants/property-types';
var translateCommon = prefix('reporting-data.properties.common');
export var getPropertyGroups = function getPropertyGroups() {
  return getInboundDbPropertyGroups(FEEDBACK_SUBMISSIONS).then(function (groups) {
    return List(_toConsumableArray(groups));
  }).then(function (groups) {
    return mergeProperties(groups, 'feedbacksubmissioninformation', {
      hs_object_id: {
        name: 'hs_object_id',
        type: ENUMERATION,
        label: translateCommon('hs_object_id'),
        hidden: true
      }
    });
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(FEEDBACK_SUBMISSIONS));
  })();
};