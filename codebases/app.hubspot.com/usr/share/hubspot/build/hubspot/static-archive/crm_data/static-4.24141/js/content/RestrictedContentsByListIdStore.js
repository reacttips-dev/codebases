'use es6';

import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import * as RestrictedContentAPI from 'crm_data/content/RestrictedContentAPI';
import { RESTRICTED_CONTENTS_BY_LIST } from '../actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
registerLazyKeyService({
  namespace: RESTRICTED_CONTENTS_BY_LIST,
  fetch: RestrictedContentAPI.fetchVisibleContentsForList
});
export default defineLazyKeyStore({
  namespace: RESTRICTED_CONTENTS_BY_LIST,
  idIsValid: function idIsValid(id) {
    return ['string', 'number'].includes(typeof id);
  }
}).defineName('RestrictedContentsByListIdStore').register(dispatcher);