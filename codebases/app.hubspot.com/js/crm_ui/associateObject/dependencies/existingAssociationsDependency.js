'use es6';

import AssociationsStore from 'crm_data/associations/AssociationsStore';
import { isLoading, isEmpty } from 'crm_data/flux/LoadingStatus';
export default {
  stores: [AssociationsStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType,
        associationObjectType = _ref.associationObjectType,
        subjectId = _ref.subjectId;
    var associatedIds = AssociationsStore.get({
      objectId: subjectId,
      objectType: objectType,
      associationType: objectType + "_TO_" + associationObjectType
    });

    if (isLoading(associatedIds) || isEmpty(associatedIds)) {
      return associatedIds;
    }

    return associatedIds.get('results').toArray();
  }
};