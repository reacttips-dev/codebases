'use es6';

import { get, put } from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';

var fetch = function fetch(associationObjectTypes) {
  return get("associations/v1/definitions/" + associationObjectTypes.get('fromObjectType') + "/" + associationObjectTypes.get('toObjectType')).then(function (response) {
    return response.toJS();
  });
};

export var fetchLabelsForObjectTypes = makeBatch(fetch, 'AssociationLabelsApi.fetch');
export var bulkAddAssociationLabels = function bulkAddAssociationLabels(associationLabels) {
  return put("associations/v1/associations", associationLabels);
};