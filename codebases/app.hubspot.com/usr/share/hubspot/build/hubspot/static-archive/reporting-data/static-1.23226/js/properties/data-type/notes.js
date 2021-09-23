'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { NOTES } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import countProperty from '../partial/count-property';
import engagementModule from '../../dataTypeDefinitions/inboundDb/engagement';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
var translateNotes = prefix('reporting-data.properties.notes');
var translateGroup = prefix('reporting-data.groups.engagement');
export var getNotePropertyGroups = function getNotePropertyGroups() {
  return Promise.resolve(List.of(ImmutableMap({
    name: 'noteInfo',
    displayName: translateGroup('noteInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([ImmutableMap({
      name: 'note.body',
      label: translateNotes('body'),
      type: 'string'
    })])
  })));
};
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(getNotePropertyGroups().then(function (notePropertyGroups) {
    return List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(notePropertyGroups)));
  }));
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(NOTES));
  })().then(overridePropertyTypes(engagementModule.getInboundSpec()));
};