'use es6';

import { LEGACY_ACTIVE_OWNERS } from '../actions/ActionNamespaces';
import dispatcher from 'dispatcher/dispatcher';
import formatName from 'I18n/utils/formatName';
import { getId } from 'customer-data-objects/protocol/Identifiable';
import { defineLazyValueStore } from '../store/LazyValueStore';
import map from 'transmute/map';
import { legacyFetchActiveOwners } from './OwnersAPI';
import pipe from 'transmute/pipe';
import sortBy from 'transmute/sortBy';
export var sortActiveOwnerIds = pipe(sortBy(function (owner) {
  var email = owner.email,
      firstName = owner.firstName,
      lastName = owner.lastName;
  var name = formatName({
    firstName: firstName,
    lastName: lastName
  });
  return (name + " " + email).toLowerCase();
}), map(getId));
export default defineLazyValueStore({
  namespace: LEGACY_ACTIVE_OWNERS,
  fetch: legacyFetchActiveOwners,
  responseTransform: sortActiveOwnerIds
}).defineName('LegacyActiveOwnerIdsStore').register(dispatcher);