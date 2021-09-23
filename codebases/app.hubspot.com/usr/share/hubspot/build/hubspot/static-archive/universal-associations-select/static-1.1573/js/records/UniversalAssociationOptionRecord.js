'use es6';

import { Record } from 'immutable';
var UniversalAssociationOptionRecord = Record({
  isDefaultAssociation: false,
  isSelected: false,
  objectId: undefined,
  primaryDisplayLabel: undefined,
  secondaryDisplayLabel: undefined,
  currentUserCanCommunicate: true
}, 'UniversalAssociationOptionRecord');
export default UniversalAssociationOptionRecord;