'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { TASKS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getCommonPropertyGroups from '../partial/engagement-common';
import countProperty from '../partial/count-property';
import { getOptions } from '../partial/status-options';
var translateGroup = prefix('reporting-data.groups.engagement');
var translateProperty = prefix('reporting-data.properties.tasks');
export var getTaskPropertyGroups = function getTaskPropertyGroups() {
  return Promise.resolve(List.of(ImmutableMap({
    name: 'taskInfo',
    displayName: translateGroup('taskInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([ImmutableMap({
      name: 'task.status',
      label: translateProperty('taskStatus.label'),
      type: 'enumeration',
      options: getOptions()
    }), ImmutableMap({
      name: 'task.subject',
      label: translateProperty('taskSubject.label'),
      type: 'string'
    }), ImmutableMap({
      name: 'task.body',
      label: translateProperty('taskBody.label'),
      type: 'string'
    }), ImmutableMap({
      name: 'task.completionDate',
      label: translateProperty('taskCompletionDate.label'),
      type: 'datetime'
    }), ImmutableMap({
      name: 'task.taskType',
      label: translateProperty('taskType.label'),
      type: 'enumeration',
      options: List([ImmutableMap({
        value: 'EMAIL',
        label: translateProperty('taskType.options.EMAIL')
      }), ImmutableMap({
        value: 'CALL',
        label: translateProperty('taskType.options.CALL')
      }), ImmutableMap({
        value: 'TODO',
        label: translateProperty('taskType.options.TODO')
      })])
    })])
  })));
};
export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(getTaskPropertyGroups().then(function (propertyGroups) {
    return List([].concat(_toConsumableArray(getCommonPropertyGroups()), _toConsumableArray(propertyGroups)));
  }));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties.merge(countProperty(TASKS));
});