'use es6';

import { OrderedMap, Record } from 'immutable';
var UniversalAssociationRecord = Record({
  associationCategory: undefined,
  associationTypeId: undefined,
  associationOptionRecords: OrderedMap(),
  hasMore: false,
  offset: undefined,
  pluralObjectName: undefined,
  primaryDisplayLabelGetter: undefined,
  // Function that is passed into a reference-resolver
  secondaryDisplayLabelGetter: undefined,
  // Function that is passed into a reference-resolver
  toObjectType: undefined,
  toObjectTypeId: undefined
}, 'UniversalAssociationRecord');
export default UniversalAssociationRecord;