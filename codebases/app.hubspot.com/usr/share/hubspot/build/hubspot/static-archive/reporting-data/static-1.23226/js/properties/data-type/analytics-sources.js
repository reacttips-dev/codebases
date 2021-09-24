'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List } from 'immutable';
import getSourcesPropertyGroups from '../partial/analytics-partial-sources';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import { createUnifiedProperties } from './unified';
export var getPropertyGroups = function getPropertyGroups() {
  return createUnifiedProperties('ANALYTICS_SOURCES').getPropertyGroups().then(function (unifiedGroups) {
    return List([].concat(_toConsumableArray(unifiedGroups), _toConsumableArray(getSourcesPropertyGroups())));
  });
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups);