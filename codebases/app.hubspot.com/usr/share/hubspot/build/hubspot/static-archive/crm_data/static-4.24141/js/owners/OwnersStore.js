'use es6';

import { OWNERS } from '../actions/ActionNamespaces';
import { LEGACY_ACTIVE_OWNERS_FETCH_SUCCEEDED, OWNERS_SEARCH_FETCH_SUCCEEDED, OWNER_IDS_BY_EMAIL_FETCH_SUCCEEDED, OWNER_IDS_BY_REMOTE_ID_FETCH_SUCCEEDED, OWNERS_UPDATE_SUCCEEDED } from '../actions/ActionTypes';
import dispatcher from 'dispatcher/dispatcher';
import either from 'transmute/either';
import { getIdString } from 'customer-data-objects/protocol/Identifiable';
import identity from 'transmute/identity';
import isNumber from 'transmute/isNumber';
import isString from 'transmute/isString';
import { defineLazyKeyStore, registerLazyKeyService } from '../store/LazyKeyStore';
import { fetchByIds } from './OwnersAPI';
import { reduceIntoState, reduceSearchResponseIntoState } from '../store/ResponseToStateTransforms';
import toString from 'transmute/toString';
var reduceIntoStateById = reduceIntoState(getIdString, identity);
registerLazyKeyService({
  namespace: OWNERS,
  fetch: fetchByIds,
  idTransform: toString
});
export default defineLazyKeyStore({
  namespace: OWNERS,
  idIsValid: either(isNumber, isString),
  idTransform: toString
}).defineName('OwnersStore').defineResponseTo([LEGACY_ACTIVE_OWNERS_FETCH_SUCCEEDED, OWNER_IDS_BY_EMAIL_FETCH_SUCCEEDED, OWNER_IDS_BY_REMOTE_ID_FETCH_SUCCEEDED, OWNERS_UPDATE_SUCCEEDED], reduceIntoStateById).defineResponseTo(OWNERS_SEARCH_FETCH_SUCCEEDED, reduceSearchResponseIntoState(reduceIntoStateById)).register(dispatcher);