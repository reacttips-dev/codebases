'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS } from 'immutable';
import prefix from '../../lib/prefix';
import { Promise } from '../../lib/promise';
import sources from '../partial/contacts-sources';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
var translate = prefix('reporting-data.properties.attribution');
var translateGroup = prefix('reporting-data.groups.attribution');

var dimensions = function dimensions() {
  return [{
    name: 'REFERRER',
    type: 'string',
    label: translate('referrer')
  }, {
    name: 'URL',
    type: 'string',
    label: translate('url')
  }, {
    name: 'SOURCE',
    type: 'enumeration',
    label: translate('source'),
    options: sources().toJS()
  }];
};

var metrics = function metrics() {
  return [{
    name: 'contactsAssisted',
    type: 'number',
    label: translate('contactsAssisted')
  }, {
    name: 'percentOfContacts',
    type: 'percent',
    label: translate('percentOfContacts')
  }, {
    name: 'normalizedScore',
    type: 'number',
    label: translate('normalizedScore')
  }];
};

export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(fromJS([{
    name: 'attributionInfo',
    displayName: translateGroup('attributionInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [].concat(_toConsumableArray(dimensions()), _toConsumableArray(metrics()))
  }]));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties;
});