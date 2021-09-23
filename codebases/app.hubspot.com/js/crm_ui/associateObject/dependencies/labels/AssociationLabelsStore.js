'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { fetchLabelsForObjectTypes } from './AssociationLabelsAPI';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { Map as ImmutableMap } from 'immutable';
registerLazyKeyService({
  namespace: 'ASSOCIATION_LABELS',
  fetch: fetchLabelsForObjectTypes
});
export default defineLazyKeyStore({
  namespace: 'ASSOCIATION_LABELS',
  idIsValid: function idIsValid() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        fromObjectType = _ref.fromObjectType,
        toObjectType = _ref.toObjectType;

    return fromObjectType && toObjectType && typeof fromObjectType === 'string' && typeof toObjectType === 'string';
  },
  idTransform: ImmutableMap
}).defineName('AssociationLabelsStore').register(dispatcher);