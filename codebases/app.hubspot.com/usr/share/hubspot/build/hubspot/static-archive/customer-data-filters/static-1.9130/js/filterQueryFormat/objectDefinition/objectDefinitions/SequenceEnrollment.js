'use es6';

import { SEQUENCE_ENROLLMENT } from 'customer-data-objects/constants/ObjectTypes';
import { SEQUENCE_ENROLLMENT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import ObjectDefinitionRecord from '../ObjectDefinitionRecord';
import AllObjectPropertiesReferenceResolver from 'reference-resolvers/resolvers/AllObjectPropertiesReferenceResolver';
var SequenceEnrollment = ObjectDefinitionRecord({
  enableAsAssociatedType: true,
  gates: ['Sequences:FilterFamily'],
  objectType: SEQUENCE_ENROLLMENT,
  objectTypeId: SEQUENCE_ENROLLMENT_TYPE_ID,
  propertyResolver: AllObjectPropertiesReferenceResolver(SEQUENCE_ENROLLMENT_TYPE_ID, {}),
  referenceObjectType: "SEQUENCE_ENROLLMENT_PROPERTIES"
});
export default SequenceEnrollment;