'use es6';

import { fromJS, List, Map as ImmutableMap } from 'immutable';
import chunk from '../../lib/async/chunk';
import { Promise } from '../../lib/promise';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { makeOption } from '../Option';
import I18n from 'I18n';

var getTickets = function getTickets() {
  var tickets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  return chunk(function (group) {
    return http.post('contacts/search/v1/search/services/tickets?properties=subject', {
      data: {
        count: group.size,
        filterGroups: [{
          filters: [{
            property: 'hs_ticket_id',
            operator: 'IN',
            values: group.toArray()
          }]
        }]
      }
    }).then(toJS);
  }, function (responses) {
    return responses[0].results;
  }, tickets);
};

export var generateTicketLabel = function generateTicketLabel(ticketInfo, id) {
  if (id) {
    return ticketInfo.get('subject') ? ticketInfo.get('subject') + " (" + id + ")" : I18n.text('reporting-data.references.ticket.unknown-with-id', {
      id: id
    });
  }

  return ticketInfo.getIn(['properties', 'subject', 'value']);
};
export default (function (ids) {
  if (ids.isEmpty()) {
    return Promise.resolve(ImmutableMap());
  }

  var sanitized = ids.reduce(function (memo, id) {
    var parsed = Number(id);
    return parsed ? memo.set(String(parsed), id) : memo;
  }, ImmutableMap());
  return getTickets(sanitized.keySeq().toList()).then(function (tickets) {
    return fromJS(tickets).reduce(function (options) {
      var ticketInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
      var ticketId = ticketInfo.get('objectId');
      return options.set(String(ticketId), makeOption(sanitized.get(ticketId, ticketId), generateTicketLabel(ticketInfo)));
    }, ImmutableMap());
  });
});