'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import invariant from 'react-utils/invariant';
import PortalIdParser from 'PortalIdParser';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { ES_DATA_UPDATED, TICKETS_CREATE_FAILED, TICKETS_CREATE_QUEUED, TICKETS_CREATE_SUCCEEDED, TICKETS_UPDATE_FAILED, TICKETS_UPDATE_STARTED, TICKETS_UPDATE_SUCCEEDED, TICKETS_UPDATED, TICKETS_REFRESH_QUEUED, TICKET_STAGE_CHANGE, TICKET_STAGE_CHANGE_REVERT, ASSOCIATIONS_REFRESH_QUEUED, OBJECT_ASSOCIATION_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import * as TicketsAPI from 'crm_data/tickets/api/TicketsAPI';
import * as ImmutableModel from 'customer-data-objects/model/ImmutableModel';
import { TICKET_TO_COMPANY, TICKET_TO_CONTACT, TICKET_TO_DEAL } from 'crm_data/associations/AssociationTypes';

var makeAssociationKey = function makeAssociationKey(id, associationType) {
  return ImmutableMap({
    objectId: id,
    objectType: TICKET,
    associationType: associationType
  });
};

export function createTicket(ticketRecord) {
  var getPropertiesList = function getPropertiesList(objectRecord) {
    return objectRecord.get('properties').reduce(function (list, _ref, name) {
      var value = _ref.value,
          sourceId = _ref.sourceId,
          source = _ref.source;
      return list.push({
        value: value,
        name: name,
        sourceId: sourceId,
        source: source
      });
    }, List());
  };

  var apiPayload = {
    associations: {},
    portalId: PortalIdParser.get(),
    properties: getPropertiesList(ticketRecord)
  };
  dispatchImmediate(TICKETS_CREATE_QUEUED);
  return TicketsAPI.createTicket(apiPayload).then(function (ticket) {
    dispatchQueue(TICKETS_CREATE_SUCCEEDED, ticket);
    return ticket;
  }).catch(function (_) {
    return dispatchQueue(TICKETS_CREATE_FAILED, _);
  });
}
export function createTicketWithAssociations(ticketRecord, _ref2) {
  var requestedAssociatedObjects = _ref2.requestedAssociatedObjects;

  var getPropertiesList = function getPropertiesList(objectRecord) {
    return objectRecord.get('properties').reduce(function (list, _ref3, name) {
      var value = _ref3.value,
          sourceId = _ref3.sourceId,
          source = _ref3.source;
      return list.push({
        value: value,
        name: name,
        sourceId: sourceId,
        source: source
      });
    }, List());
  };

  var propertyValues = getPropertiesList(ticketRecord);
  dispatchImmediate(TICKETS_CREATE_QUEUED);
  return TicketsAPI.createTicketWithAssociations({
    propertyValues: propertyValues,
    requestedAssociatedObjects: requestedAssociatedObjects
  }).then(function (ticket) {
    dispatchQueue(TICKETS_CREATE_SUCCEEDED, ticket);
    requestedAssociatedObjects.forEach(function (association) {
      dispatchQueue(OBJECT_ASSOCIATION_SUCCEEDED, {
        objectId: association.objectId,
        associationsAdded: [ImmutableModel.getId(ticket)],
        fromObjectType: association.objectType,
        toObjectType: TICKET
      });
    });
    return ticket;
  }).catch(function (error) {
    dispatchQueue(TICKETS_CREATE_FAILED, error);
    throw error;
  });
}
export function updateElasticSearch(ticket, searchQuery, searchResults) {
  var ticketId = ImmutableModel.getId(ticket);
  var optimisticResults = searchResults.update('_results', function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return results.push(ticketId);
  }).update('results', function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return results.push(ticketId);
  }).update('total', function () {
    var total = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return total + 1;
  });
  dispatchQueue(TICKETS_UPDATED, ImmutableMap(_defineProperty({}, ticketId, ticket)));
  dispatchQueue(ES_DATA_UPDATED, {
    objectType: TICKET,
    searchQuery: searchQuery,
    results: optimisticResults
  });
}
export function revertMove(ticketId) {
  return dispatchImmediate(TICKET_STAGE_CHANGE_REVERT, ticketId);
}
export function updateTickets(tickets) {
  invariant(ImmutableMap.isMap(tickets), 'TicketsActions: expected tickets to be a Map but got `%s`', tickets);
  return dispatchImmediate(TICKETS_UPDATED, tickets);
}
export function updateTicketProperties(ticket, nextProperties, options) {
  if (options == null) {
    options = {};
  }

  var ticketActionPayload = {
    id: "" + ImmutableModel.getId(ticket),
    nextProperties: nextProperties,
    properties: nextProperties.map(function (_, name) {
      return ImmutableModel.getProperty(ticket, name);
    }),
    options: options
  };

  if (nextProperties.has('hs_pipeline_stage') && !options.updatedValues) {
    dispatchImmediate(TICKET_STAGE_CHANGE, ticketActionPayload);
    return Promise.resolve();
  }

  dispatchImmediate(TICKETS_UPDATE_STARTED, ticketActionPayload);
  return TicketsAPI.updateTicketProperties(ticket, nextProperties).then(function (nextTicket) {
    dispatchImmediate(TICKETS_UPDATE_SUCCEEDED, {
      id: "" + ImmutableModel.getId(nextTicket),
      nextProperties: nextProperties
    });
  }).catch(function (error) {
    dispatchImmediate(TICKETS_UPDATE_FAILED, Object.assign({}, ticketActionPayload, {
      error: error
    }));
    throw error;
  });
}
export function deleteTicket(ticketId, callback) {
  return TicketsAPI.deleteTicket(ticketId).then(function () {
    setTimeout(function () {
      dispatchImmediate(TICKETS_UPDATED, ImmutableMap().set("" + ticketId, null));
    }, 0);
    return typeof callback === 'function' ? callback() : undefined;
  });
}
export function refresh(ids) {
  dispatchQueue(TICKETS_REFRESH_QUEUED, ImmutableSet(ids));
  dispatchQueue(ASSOCIATIONS_REFRESH_QUEUED, ImmutableSet([makeAssociationKey(ids[0], TICKET_TO_COMPANY), makeAssociationKey(ids[0], TICKET_TO_CONTACT), makeAssociationKey(ids[0], TICKET_TO_DEAL)]));
}