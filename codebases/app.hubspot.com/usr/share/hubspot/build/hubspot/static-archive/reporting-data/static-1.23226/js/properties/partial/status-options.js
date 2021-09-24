'use es6';

import { Map as ImmutableMap, OrderedMap } from 'immutable';
import prefix from '../../lib/prefix';
var translateProperty = prefix('reporting-data.properties.tasks');

var mapToLabels = function mapToLabels() {
  return OrderedMap([['COMPLETED', translateProperty('taskStatus.options.COMPLETED')], ['NOT_STARTED', translateProperty('taskStatus.options.NOT_STARTED')], ['IN_PROGRESS', translateProperty('taskStatus.options.IN_PROGRESS')], ['WAITING', translateProperty('taskStatus.options.WAITING')], ['DEFERRED', translateProperty('taskStatus.options.DEFERRED')]]);
};

export var STATUS = function STATUS() {
  return mapToLabels().keySeq().toSet().toMap().toJS();
};
export var getOptions = function getOptions() {
  return mapToLabels().map(function (label, value) {
    return ImmutableMap({
      label: label,
      value: value
    });
  }).valueSeq().toList();
};