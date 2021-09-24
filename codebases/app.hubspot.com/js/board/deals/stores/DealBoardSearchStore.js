'use es6';

import * as DealBoardSearchAPI from '../api/DealBoardSearchAPI';
import { DEAL_PIPELINE_SEARCH } from 'crm_data/actions/ActionNamespaces';
import { getId, getProperty } from 'customer-data-objects/model/ImmutableModel';
import createSearchStore from '../../../crm_ui/flux/elasticSearch/createSearchStore';
import DealBoardSearchActionTypes from '../../../crm_ui/board/deals/DealBoardSearchActionTypes';
import DealsStore from 'crm_data/deals/DealsStore';
import { List } from 'immutable';
var DealBoardSearchStore = createSearchStore(DEAL_PIPELINE_SEARCH, DealBoardSearchActionTypes, DealBoardSearchAPI);
export default DealBoardSearchStore.defineResponseTo(DealBoardSearchActionTypes.MOVED, function (state, _ref) {
  var _key = _ref.key,
      searchQuery = _ref.searchQuery,
      from = _ref.from,
      to = _ref.to,
      id = _ref.id,
      toIndex = _ref.toIndex;
  var key = DealBoardSearchStore.getKey(_key, searchQuery);
  var results = state.getIn(key);

  if (results) {
    var fromItems = results.getIn(['items', from]) || List();
    var fromAggregation = results.getIn(['aggregation', from]);
    var fromCount = results.getIn(['count', from]);
    var toItems = results.getIn(['items', to]) || List();
    var toAggregation = results.getIn(['aggregation', to]);
    var toCount = results.getIn(['count', to]);
    var deal = fromItems.find(function (_deal) {
      return getId(_deal) === id;
    });

    if (!deal) {
      deal = DealsStore.get(id);
    }

    if (deal) {
      var amountPropertyName = results.get('isAggregationMultiCurrency') ? 'amount_in_home_currency' : 'amount';
      var amount = parseFloat(getProperty(deal, amountPropertyName) || 0);
      var index = fromItems.indexOf(deal);
      fromAggregation -= amount;
      fromCount -= 1;

      if (index !== -1) {
        fromItems = fromItems.delete(index);
      }

      toAggregation += amount;
      toCount += 1;
      toItems = toItems.insert(toIndex, deal);
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