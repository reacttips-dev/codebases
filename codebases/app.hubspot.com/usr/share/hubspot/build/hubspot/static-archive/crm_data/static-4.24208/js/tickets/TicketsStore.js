'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { TICKETS } from 'crm_data/actions/ActionNamespaces';
import { fetch } from 'crm_data/tickets/api/TicketsAPI';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { TICKETS_CREATE_SUCCEEDED, TICKETS_UPDATE_STARTED, TICKETS_UPDATE_FAILED, TICKETS_UPDATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { setProperty, getProperty } from 'customer-data-objects/model/ImmutableModel';
import toString from 'transmute/toString';
registerLazyKeyService({
  namespace: TICKETS,
  fetch: fetch
});
export default defineLazyKeyStore({
  namespace: TICKETS,
  idIsValid: function idIsValid(id) {
    return typeof id === 'string' || typeof id === 'number';
  },
  idTransform: toString
}).defineResponseTo(TICKETS_CREATE_SUCCEEDED, function (state, ticket) {
  var id = ticket.objectId;
  return state.set(id, ticket);
}).defineResponseTo([TICKETS_UPDATE_STARTED, TICKETS_UPDATE_SUCCEEDED], function (state, _ref) {
  var id = _ref.id,
      nextProperties = _ref.nextProperties;

  if (!state.has(id)) {
    return state;
  }

  return state.updateIn([id], function (ticket) {
    return nextProperties.reduce(function (acc, value, name) {
      return setProperty(acc, name, value);
    }, ticket);
  });
}).defineResponseTo(TICKETS_UPDATE_FAILED, function (state, _ref2) {
  var id = _ref2.id,
      nextProperties = _ref2.nextProperties,
      properties = _ref2.properties;
  return state.updateIn([id], function (ticket) {
    return properties.reduce(function (acc, value, name) {
      if (nextProperties.get(name) !== getProperty(acc, name)) {
        return acc;
      }

      return setProperty(acc, name, value);
    }, ticket);
  });
}).defineName('TicketsStore').register(dispatcher);