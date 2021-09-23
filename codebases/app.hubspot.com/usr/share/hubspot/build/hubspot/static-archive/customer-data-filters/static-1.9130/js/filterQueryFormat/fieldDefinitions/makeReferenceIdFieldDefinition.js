'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { ENUMERATION } from 'customer-data-objects/property/PropertyTypes';
import { OrderedSet } from 'immutable';
import Equal from '../operator/Equal';
import FieldDefinitionRecord from './FieldDefinitionRecord';
import Known from '../operator/Known';
import NotEqual from '../operator/NotEqual';
import NotKnown from '../operator/NotKnown';
import invariant from 'react-utils/invariant';
export var makeReferenceIdFieldDefinition = function makeReferenceIdFieldDefinition(options) {
  var referencedObjectType = options.referencedObjectType,
      rest = _objectWithoutProperties(options, ["referencedObjectType"]);

  invariant(referencedObjectType, 'Reference Id fields require a referencedObjectType');
  return FieldDefinitionRecord(Object.assign({}, rest, {
    inputType: ENUMERATION,
    operators: OrderedSet.of(Equal, NotEqual, Known, NotKnown),
    referencedObjectType: referencedObjectType
  }));
};