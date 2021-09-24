'use es6';

import { Record } from 'immutable';
var FieldDefinitionRecord = Record({
  getDescriptionString: undefined,
  getLabelString: undefined,
  InputComponent: undefined,
  inputType: undefined,
  operators: undefined,
  referencedObjectType: undefined,
  ValueComponent: undefined
}, 'FieldDefinitionRecord');

FieldDefinitionRecord.isFieldDefinitionRecord = function (field) {
  return field instanceof FieldDefinitionRecord;
};

export default FieldDefinitionRecord;