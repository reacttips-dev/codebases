'use es6';

import { Map as ImmutableMap } from 'immutable';
import memoize from 'transmute/memoize';
import { getEngagementsV2UniversalAssociationRecord } from './EngagementsV2UASHelpers';
export var getSelectedAssociations = memoize(function (associations) {
  return associations.reduce(function (acc, record) {
    var selectedAssociationOptionRecords = record.get('associationOptionRecords').filter(function (option) {
      return option.get('isSelected');
    });

    if (!selectedAssociationOptionRecords.size) {
      return acc;
    }

    var engagementsV2UniversalAssociation = getEngagementsV2UniversalAssociationRecord(record, selectedAssociationOptionRecords);
    return acc.concat(engagementsV2UniversalAssociation);
  }, ImmutableMap());
});