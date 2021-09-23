'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { Map as ImmutableMap } from 'immutable';
import { isValidViewLocation } from './CrmRecordCardConstants';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { fetchViewBatch } from './CrmRecordCardViewsAPI';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import get from 'transmute/get';
var CARD_CUSTOMIZATION_NAMESPACE = 'CARD_CUSTOMIZATION';
var CARD_CUSTOMIZATION_VIEW_STORE_NAME = 'CrmRecordCardViewsStore';
var getObjectTypeId = get('objectTypeId');
var getLocation = get('location');
registerLazyKeyService({
  namespace: CARD_CUSTOMIZATION_NAMESPACE,
  fetch: fetchViewBatch
});
export default defineLazyKeyStore({
  namespace: CARD_CUSTOMIZATION_NAMESPACE,
  idTransform: function idTransform(options) {
    return ImmutableMap({
      objectTypeId: getObjectTypeId(options),
      location: getLocation(options)
    });
  },
  idIsValid: function idIsValid(options) {
    return isObjectTypeId(getObjectTypeId(options)) && isValidViewLocation(getLocation(options));
  }
}).defineName(CARD_CUSTOMIZATION_VIEW_STORE_NAME).register(dispatcher);