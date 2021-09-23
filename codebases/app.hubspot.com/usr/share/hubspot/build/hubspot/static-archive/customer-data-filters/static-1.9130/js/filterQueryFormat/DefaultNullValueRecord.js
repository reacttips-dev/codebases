'use es6';

import { Record } from 'immutable';
var DefaultNullValueRecord = Record({
  defaultComparisonValue: null,
  defaultValue: null,
  includeObjectsWithNoValueSet: undefined
}, 'DefaultNullValueRecord');

DefaultNullValueRecord.isDefined = function (record) {
  return record.defaultValue !== null || record.defaultComparisonValue !== null;
};

DefaultNullValueRecord.isDefaultNullValueRecord = function (record) {
  return record instanceof DefaultNullValueRecord;
};

export default DefaultNullValueRecord;