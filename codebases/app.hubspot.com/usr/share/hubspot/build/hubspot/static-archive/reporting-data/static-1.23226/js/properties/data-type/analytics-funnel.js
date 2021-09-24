'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { CONTACTS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
var translateDataType = prefix('reporting-data.dataTypes');
var translateCommon = prefix('reporting-data.properties.common');
var translate = prefix('reporting-data.properties.events');
var translateGroup = prefix('reporting-data.groups.events');
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(List([ImmutableMap({
    name: 'eventInfo',
    displayName: translateGroup('eventInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([ImmutableMap({
      name: 'event',
      type: 'enumeration',
      label: translate('event')
    }), ImmutableMap({
      name: 'count',
      type: 'number',
      label: translateCommon('count', {
        object: translateDataType(CONTACTS)
      })
    }), ImmutableMap({
      name: 'funnel.conversion',
      type: 'percent',
      label: translateCommon('conversion')
    })])
  })]));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups);