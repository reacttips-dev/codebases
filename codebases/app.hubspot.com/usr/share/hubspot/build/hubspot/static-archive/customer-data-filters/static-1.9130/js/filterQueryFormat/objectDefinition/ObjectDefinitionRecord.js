'use es6';

import { Record } from 'immutable';
import emptyFunction from 'react-utils/emptyFunction'; // NOTE: translations are required and must be added manually
// Any fields that values are another record type need to be updated in customer-data-objects/property/PropertyNameToReferenceType
// Most of the data for these records should be defined in customer-data-objects and imported here

var ObjectDefinitionRecord = Record({
  // When true, this object will be able to be used in association filters for objects with defined associations to this object
  enableAsAssociatedType: false,
  // An optional array of gates, all must be met for the object to be used as an associated type
  gates: undefined,
  // The name of the object, should be defined in 'customer-data-objects/constants/ObjectTypes'
  objectType: '',
  // The object type id, should be defined in 'customer-data-objects/constants/ObjectTypeIds'
  objectTypeId: '',
  // Resolver function for fetching properties of this object type, should be defined 'reference-resolvers/resolvers/'
  propertyResolver: emptyFunction,
  // Reference type, should be defined in 'reference-resolvers/constants/ReferenceObjectTypes'
  referenceObjectType: ''
}, 'ObjectDefinition');
export default ObjectDefinitionRecord;