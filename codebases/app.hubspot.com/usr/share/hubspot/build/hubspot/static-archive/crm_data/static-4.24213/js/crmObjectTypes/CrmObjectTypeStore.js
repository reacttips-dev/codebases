'use es6';

import * as CrmObjectTypeAPI from './CrmObjectTypeAPI';
import { CRM_OBJECT_TYPES } from 'crm_data/actions/ActionNamespaces';
import { CrmObjectTypeRecord } from './CrmObjectTypeRecords';
import { Map as ImmutableMap } from 'immutable';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import dispatcher from 'dispatcher/dispatcher';
import get from 'transmute/get';
import has from 'transmute/has';
import reduce from 'transmute/reduce';
import { EMPTY, isResolved } from '../flux/LoadingStatus';
var config = {
  serialize: function serialize(val) {
    return CrmObjectTypeRecord.fromJSON(val);
  }
};

var responseTransform = function responseTransform(list) {
  return reduce(ImmutableMap(), function (acc, val) {
    var instance = config.serialize(val.toJS());
    return acc.set(instance.objectTypeId, instance);
  }, list);
};

var CrmObjectTypeStore = defineLazyValueStore({
  fetch: CrmObjectTypeAPI.fetchAllObjectTypes,
  namespace: CRM_OBJECT_TYPES,
  responseTransform: responseTransform,
  getterTransform: function getterTransform(_ref) {
    var value = _ref.value,
        objectTypeId = _ref.options;

    if (isResolved(value) && isObjectTypeId(objectTypeId)) {
      return has(objectTypeId, value) ? get(objectTypeId, value) : EMPTY;
    }

    return value;
  }
}).defineName('CrmObjectTypeStore').register(dispatcher);

CrmObjectTypeStore.configure = function (_ref2) {
  var serialize = _ref2.serialize;

  if (typeof serialize === 'function') {
    config.serialize = serialize;
  }
};

export default CrmObjectTypeStore;