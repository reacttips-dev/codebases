'use es6';

import { OWNER_IDS_BY_EMAIL } from '../actions/ActionNamespaces';
import { LEGACY_ACTIVE_OWNERS_FETCH_SUCCEEDED, OWNERS_FETCH_SUCCEEDED, OWNER_IDS_BY_REMOTE_ID_FETCH_SUCCEEDED, OWNERS_SEARCH_FETCH_SUCCEEDED, OWNERS_UPDATE_SUCCEEDED } from '../actions/ActionTypes';
import dispatcher from 'dispatcher/dispatcher';
import get from 'transmute/get';
import { getId } from 'customer-data-objects/protocol/Identifiable';
import isString from 'transmute/isString';
import { defineLazyKeyStore, registerLazyKeyService } from '../store/LazyKeyStore';
import { fetchByEmails } from './OwnersAPI';
import { reduceIntoState, reduceSearchResponseIntoState } from '../store/ResponseToStateTransforms';
var reduceIdIntoStateByEmail = reduceIntoState(get('email'), getId);
registerLazyKeyService({
  namespace: OWNER_IDS_BY_EMAIL,
  fetch: fetchByEmails
});
export default defineLazyKeyStore({
  namespace: OWNER_IDS_BY_EMAIL,
  idIsValid: isString,
  responseTransform: getId
}).defineName('OwnerIdsByEmailStore').defineResponseTo([LEGACY_ACTIVE_OWNERS_FETCH_SUCCEEDED, OWNERS_FETCH_SUCCEEDED, OWNER_IDS_BY_REMOTE_ID_FETCH_SUCCEEDED, OWNERS_UPDATE_SUCCEEDED], reduceIdIntoStateByEmail).defineResponseTo(OWNERS_SEARCH_FETCH_SUCCEEDED, reduceSearchResponseIntoState(reduceIdIntoStateByEmail)).register(dispatcher);