'use es6';

import { Map as ImmutableMap, Record, Set as ImmutableSet } from 'immutable'; // This record is used in the EngagementAssociationsStore and the format in which
// engagements/v2 API creates custom object associations

var EngagementsV2UniversalAssociationRecord = Record({
  associationOptionRecordsMap: ImmutableMap(),
  associationSpec: ImmutableMap({
    associationCategory: undefined,
    associationTypeId: undefined
  }),
  objectIds: ImmutableSet()
}, 'EngagementsV2UniversalAssociationRecord');
export default EngagementsV2UniversalAssociationRecord;