'use es6';

import { PORTAL_TZ_ALIGNED } from '../timestamps/TimestampTypes';
import { Record } from 'immutable';
import { STRING } from 'customer-data-objects/property/PropertyTypes';
import { TEXT } from 'customer-data-objects/property/PropertyFieldTypes';
var FORMATTED = 'formatted';
var DSFieldRecord = Record({
  description: '',
  displayName: '',
  displayOrder: 0,
  displayType: null,
  externalOptions: false,
  fieldType: TEXT,
  groupName: null,
  hidden: false,
  hubspotDefined: false,
  isHiddenFromSelect: false,
  label: '',
  metadata: null,
  name: '',
  numberDisplayHint: FORMATTED,
  options: null,
  referencedObjectType: null,
  refinement: false,
  searchable: true,
  showCurrencySymbol: false,
  timestampType: PORTAL_TZ_ALIGNED,
  type: STRING,
  url: null,
  wrappedObject: null,
  disabled: false,
  tooltip: '',
  placeholder: ''
}, 'DSFieldRecord');

DSFieldRecord.fromJS = function (json) {
  if (json === null || json === undefined) {
    return json;
  }

  return DSFieldRecord(json);
};

DSFieldRecord.isDSFieldRecord = function (field) {
  return field instanceof DSFieldRecord;
};

export default DSFieldRecord;