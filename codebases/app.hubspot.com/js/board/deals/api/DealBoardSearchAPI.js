'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { List, Map as ImmutableMap } from 'immutable';
import { POST } from 'crm_data/constants/HTTPVerbs';
import { replaceSpecialTypes } from 'crm_data/filters/FilterPlaceholderResolver';
import { send } from 'crm_data/api/ImmutableAPI';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import I18n from 'I18n';
import isString from 'transmute/isString';
import memoize from 'transmute/memoize';
export var HARDCODED_PROPERTIES = ['amount_in_home_currency', 'amount', 'closedate', 'createdate', 'deal_currency_code', 'dealname', 'dealstage', 'hubspot_owner_id', 'hs_all_owner_ids', 'hubspot_team_id', 'hs_all_team_ids', 'notes_last_updated'];

var _getUrl = function _getUrl(pipelineId) {
  return "sales-views/v1/deals/pipeline/" + encodeURIComponent(pipelineId);
}; // TODO: This is what we eventually want (I think),
// but then we would have a lot of partial records
// in the deal store.
// _normalize = (data) ->
//   dealMap = Map()
//   results = Map(
//     columns: List()
//     items: Map()
//     count: Map()
//     aggregation: Map()
//     total: 0
//   )
//   data.forEach (dealStage) ->
//     stage = dealStage.get('stage')
//     count = dealStage.get('count')
//     aggregation = dealStage.get('aggregation')
//     deals = dealStage.get('deals').map (deal) ->
//       record = DealRecord.fromJS(deal)
//       dealId = deal.getIn(idKey)
//       dealMap = dealMap.set(dealId, record)
//       return dealId
//     stageId = stage.get('stageId')
//     columns = results.get('columns').push(stage)
//     total = results.get('total') + count
//     results = results
//       .setIn(['items', stageId], deals)
//       .setIn(['count', stageId], count)
//       .setIn(['aggregation', stageId], aggregation)
//       .set('columns', columns)
//       .set('total', total)
//   if dealMap.size > 0
//     DealsActions.updateDeals(dealMap)
//   return results


var increment = function increment(a) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return a + amount;
};

var decrement = function decrement(a) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return a - amount;
};

var incrementBy = memoize(function (n) {
  return function (a) {
    return increment(a, n);
  };
});
var decrementBy = memoize(function (n) {
  return function (a) {
    return decrement(a, n);
  };
});

var getDefaultColumnTranslationKey = function getDefaultColumnTranslationKey(columnLabel) {
  if (!isString(columnLabel)) {
    return null;
  }

  var lowercaseLabel = columnLabel.toLowerCase();

  if (lowercaseLabel === 'appointment scheduled') {
    return 'dealBoard.defaultStageNames.appointmentscheduled';
  } else if (lowercaseLabel === 'qualified to buy') {
    return 'dealBoard.defaultStageNames.qualifiedtobuy';
  } else if (lowercaseLabel === 'presentation scheduled') {
    return 'dealBoard.defaultStageNames.presentationscheduled';
  } else if (lowercaseLabel === 'decision maker bought-in') {
    return 'dealBoard.defaultStageNames.decisionmakerboughtin';
  } else if (lowercaseLabel === 'contract sent') {
    return 'dealBoard.defaultStageNames.contractsent';
  } else if (lowercaseLabel === 'closed won') {
    return 'dealBoard.defaultStageNames.closedwon';
  } else if (lowercaseLabel === 'closed lost') {
    return 'dealBoard.defaultStageNames.closedlost';
  } else {
    return null;
  }
};

var translateColumnLabel = function translateColumnLabel(column) {
  var columnLabel = column.get('label');
  var translationKey = getDefaultColumnTranslationKey(columnLabel);

  if (translationKey) {
    return I18n.text(translationKey);
  }

  return column.get('label');
};

var removeFromStage = function removeFromStage(pipelineData, deal, stage, amount) {
  return pipelineData.withMutations(function (pipeline) {
    pipeline.updateIn(['items', stage], function (fromItems) {
      var index = fromItems.indexOf(deal);

      if (index !== -1) {
        fromItems = fromItems.delete(index);
      }

      return fromItems;
    }).updateIn(['aggregation', stage], decrementBy(amount)).updateIn(['count', stage], decrement).update('total', decrement);
  });
};

var addToStage = function addToStage(pipelineData, deal, stage, amount) {
  var toIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return pipelineData.withMutations(function (pipeline) {
    pipeline.updateIn(['items', stage], function (toItems) {
      return toItems.insert(toIndex, deal);
    }).updateIn(['aggregation', stage], incrementBy(amount)).updateIn(['count', stage], increment).update('total', increment);
  });
};

export var reconcile = function reconcile(pipeline, deal, from, to) {
  var toIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var fromItems = pipeline.getIn(['items', from]);
  var amountPropertyName = pipeline.get('isAggregationMultiCurrency') ? 'amount_in_home_currency' : 'amount';
  var amount = parseFloat(getProperty(deal, amountPropertyName) || 0);
  var index = toIndex != null ? toIndex : fromItems.indexOf(deal);

  if (to && pipeline.hasIn(['items', to])) {
    var isAlreadyInStage = pipeline.getIn(['items', to]).find(function (item) {
      return get('dealId', item) === get('dealId', deal);
    });

    if (!isAlreadyInStage) {
      pipeline = addToStage(pipeline, deal, to, amount, index);
    }
  }

  return removeFromStage(pipeline, deal, from, amount);
};
export var normalize = function normalize(data) {
  var results = ImmutableMap({
    columns: List(),
    items: ImmutableMap(),
    count: ImmutableMap(),
    aggregation: ImmutableMap(),
    total: 0,
    isAggregationMultiCurrency: false
  });
  var duplicates = [];
  var stale = [];
  data.forEach(function (dealStage) {
    var stage = dealStage.get('stage');
    var count = dealStage.get('count');
    var homeCurrencyAmount = dealStage.get('homeCurrencyAmount');
    var amount = dealStage.get('amount');
    var dealsSeen = {};
    var deals = dealStage.get('deals').map(function (deal) {
      var dealRecord = DealRecord.fromJS(deal);
      var dealstage = getIn(['properties', 'dealstage', 'value'], deal);

      if (dealsSeen[dealRecord.get('dealId')]) {
        duplicates.push({
          deal: dealRecord,
          from: dealstage
        });
      } else {
        dealsSeen[dealRecord.get('dealId')] = dealRecord;
      }

      if (dealstage !== stage.get('stageId')) {
        stale.push({
          deal: dealRecord,
          to: dealstage,
          from: stage.get('stageId')
        });
      }

      return dealRecord;
    });
    var stageId = stage.get('stageId');
    var columns = results.get('columns').push(stage.set('value', stageId)).map(function (column) {
      return column.set('label', translateColumnLabel(column));
    });
    var total = results.get('total') + count;
    return results = results.setIn(['items', stageId], deals).setIn(['count', stageId], count).setIn(['aggregation', stageId], homeCurrencyAmount || amount).update('isAggregationMultiCurrency', function (prevValue) {
      return Boolean(prevValue || !!homeCurrencyAmount);
    }).set('columns', columns).set('total', total);
  });

  if (window.newrelic && (duplicates.length > 0 || stale.length > 0)) {
    window.newrelic.addPageAction('crmBoardReconcile', {
      type: DEAL,
      hasDuplicates: duplicates.length > 0,
      hasStale: stale.length > 0
    });
  }

  stale.forEach(function (_ref) {
    var deal = _ref.deal,
        from = _ref.from,
        to = _ref.to;
    results = reconcile(results, deal, from, to);
  });
  duplicates.forEach(function (_ref2) {
    var deal = _ref2.deal,
        from = _ref2.from;
    results = reconcile(results, deal, from);
  });
  return results;
};
export var search = function search(searchQuery, pipelineId) {
  if (pipelineId === undefined || pipelineId === null) {
    pipelineId = 'default';
  }

  if (!searchQuery) {
    return null;
  }

  searchQuery = searchQuery.toJS();
  searchQuery.filterGroups = searchQuery.filterGroups != null ? searchQuery.filterGroups.map(function (filterGroup) {
    filterGroup.filters = replaceSpecialTypes(filterGroup.filters);
    return filterGroup;
  }) : undefined;
  var searchQueryRequestOptions = searchQuery.requestOptions || {};
  var searchQueryRequestOptionsProperties = searchQueryRequestOptions.properties || [];
  var searchQueryProperties = searchQuery.properties || [];
  var options = {
    type: POST,
    timeout: 60 * 1000,
    // 1 minute
    query: {
      properties: [].concat(HARDCODED_PROPERTIES, _toConsumableArray(searchQueryRequestOptionsProperties), _toConsumableArray(searchQueryProperties))
    }
  };
  return send(options, _getUrl(pipelineId), searchQuery).then(normalize);
};