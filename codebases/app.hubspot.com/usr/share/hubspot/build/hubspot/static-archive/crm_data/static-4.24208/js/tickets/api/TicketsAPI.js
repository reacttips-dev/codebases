'use es6';

import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import { byIdsStr } from './TicketsAPIQuery';
import User from 'hub-http-shims/UserDataJS/user';
import { PUT, POST } from 'crm_data/constants/HTTPVerbs';
import { CONTACTS, CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { Map as ImmutableMap } from 'immutable';
var BASE_URI = 'services/v1/tickets';
var contactsCrmUiSourceHeaders = {
  'X-Properties-Source': CONTACTS,
  'X-Properties-SourceId': CRM_UI
};

var parseItems = function parseItems(result) {
  return result.reduce(function (acc, ticket, id) {
    return acc.set(String(id), TicketRecord.fromJS(ticket));
  }, ImmutableMap());
};

var toUri = function toUri(queryStr) {
  return BASE_URI + "/batch?" + queryStr + "&allPropertiesFetchMode=latest_version";
};

export function fetch(ids) {
  return ImmutableAPI.get(toUri(byIdsStr(ids))).then(parseItems);
}
export function fetchById(id) {
  return ImmutableAPI.get(BASE_URI + "/" + id).then(TicketRecord.fromJS);
}
export function createTicket(objectPayload) {
  var payload = {
    object: objectPayload
  };
  return ImmutableAPI.send({
    headers: contactsCrmUiSourceHeaders,
    type: POST
  }, BASE_URI, payload, TicketRecord.fromJS);
}
export function createTicketWithAssociations(_ref) {
  var propertyValues = _ref.propertyValues,
      requestedAssociatedObjects = _ref.requestedAssociatedObjects;
  return ImmutableAPI.send({
    headers: contactsCrmUiSourceHeaders,
    type: POST
  }, 'inbounddb-objects/v1/create-and-bulk-associate', {
    createObjectType: TICKET,
    propertyValues: propertyValues,
    requestedAssociatedObjects: requestedAssociatedObjects
  }, function (result) {
    return TicketRecord.fromJS(result);
  });
}
export function updateTicketProperties(ticket, propertyUpdates) {
  var ticketId = ticket.get('objectId');
  return ImmutableAPI.send({
    headers: contactsCrmUiSourceHeaders,
    type: PUT
  }, BASE_URI + "/" + ticketId + "?allPropertiesFetchMode=latest_version", {
    ticketId: ticketId,
    properties: propertyUpdates.reduce(function (acc, value, name) {
      acc.push({
        name: name,
        value: value,
        source: CRM_UI,
        sourceId: User.get().get('email')
      });
      return acc;
    }, [])
  }, TicketRecord.fromJS);
}
export function deleteTicket(ticketId) {
  return ImmutableAPI.delete(BASE_URI + "/" + ticketId);
}