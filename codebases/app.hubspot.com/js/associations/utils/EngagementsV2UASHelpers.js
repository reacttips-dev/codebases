'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import EngagementsV2UniversalAssociationRecord from 'universal-associations-select/records/EngagementsV2UniversalAssociationRecord';
import { Map as ImmutableMap, Set as ImmutableSet, OrderedMap } from 'immutable';
export var getEngagementsV2UniversalAssociationRecord = function getEngagementsV2UniversalAssociationRecord(associationRecord, associationOptionRecordsMap) {
  var toObjectTypeId = associationRecord.get('toObjectTypeId');
  var objectIds = ImmutableSet();
  var recordsMap = OrderedMap();

  if (associationOptionRecordsMap) {
    objectIds = ImmutableSet(associationOptionRecordsMap.keySeq());
    recordsMap = associationOptionRecordsMap;
  }

  return ImmutableMap(_defineProperty({}, toObjectTypeId, EngagementsV2UniversalAssociationRecord({
    associationOptionRecordsMap: recordsMap,
    associationSpec: ImmutableMap({
      associationCategory: associationRecord.get('associationCategory'),
      associationTypeId: associationRecord.get('associationTypeId')
    }),
    objectIds: objectIds
  })));
};