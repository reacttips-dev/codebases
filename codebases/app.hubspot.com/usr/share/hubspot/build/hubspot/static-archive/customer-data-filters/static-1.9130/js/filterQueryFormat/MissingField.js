'use es6';

import { Record } from 'immutable';
import { STRING } from 'customer-data-objects/property/PropertyTypes';
var MissingField = Record({
  errorMessage: null,
  isHiddenFromSelect: true,
  label: '',
  name: '',
  timestampType: null,
  type: STRING
}, 'MissingField');

MissingField.fromJS = function (json) {
  if (json === null || json === undefined) {
    return json;
  }

  return MissingField(json);
};

MissingField.isMissingField = function (field) {
  return field instanceof MissingField;
};

export default MissingField;