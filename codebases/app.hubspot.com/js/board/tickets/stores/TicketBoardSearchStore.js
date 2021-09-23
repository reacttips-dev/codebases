'use es6';

import * as TicketBoardSearchAPI from '../api/TicketBoardSearchAPI';
import { getId, getProperty } from 'customer-data-objects/model/ImmutableModel';
import { TICKET_PIPELINE_SEARCH } from 'crm_data/actions/ActionNamespaces';
import createSearchStore from '../../../crm_ui/flux/elasticSearch/createSearchStore';
import TicketBoardSearchActionTypes from '../../../crm_ui/board/tickets/TicketBoardSearchActionTypes';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import { List } from 'immutable';
var TicketBoardSearchStore = createSearchStore(TICKET_PIPELINE_SEARCH, TicketBoardSearchActionTypes, TicketBoardSearchAPI);
export default TicketBoardSearchStore.defineResponseTo(TicketBoardSearchActionTypes.MOVED, function (state, _ref) {
  var key = _ref.key,
      searchQuery = _ref.searchQuery,
      from = _ref.from,
      to = _ref.to,
      id = _ref.id,
      toIndex = _ref.toIndex;
  key = TicketBoardSearchStore.getKey(key, searchQuery);
  var results = state.getIn(key);

  if (results) {
    var fromItems = results.getIn(['items', from]) || List();
    var fromAggregation = results.getIn(['aggregation', from]);
    var fromCount = results.getIn(['count', from]);
    var toItems = results.getIn(['items', to]) || List();
    var toAggregation = results.getIn(['aggregation', to]);
    var toCount = results.getIn(['count', to]);
    var ticket = fromItems.find(function (_ticket) {
      return getId(_ticket) === id;
    });

    if (!ticket) {
      ticket = TicketsStore.get(id);
    }

    if (ticket) {
      var amount = parseFloat(getProperty(ticket, 'amount') || 0);
      var index = fromItems.indexOf(ticket);
      fromAggregation -= amount;
      fromCount -= 1;

      if (index !== -1) {
        fromItems = fromItems.delete(index);
      }

      toAggregation += amount;
      toCount += 1;
      toItems = toItems.insert(toIndex, ticket);
      results = results.setIn(['items', from], fromItems);
      results = results.setIn(['aggregation', from], fromAggregation);
      results = results.setIn(['count', from], fromCount);
      results = results.setIn(['items', to], toItems);
      results = results.setIn(['aggregation', to], toAggregation);
      results = results.setIn(['count', to], toCount);
      state = state.setIn(key, results);
    }
  }

  return state;
}).register();