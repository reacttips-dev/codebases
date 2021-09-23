'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { send } from 'crm_data/api/ImmutableAPI';
import { POST } from 'crm_data/constants/HTTPVerbs';
import { List, Map as ImmutableMap } from 'immutable';
import { replaceSpecialTypes } from 'crm_data/filters/FilterPlaceholderResolver';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
export var HARDCODED_PROPERTIES = ['closed_date', 'content', 'createdate', 'hs_ticket_priority', 'hs_pipeline', 'hs_pipeline_stage', 'hubspot_owner_id', 'hs_all_owner_ids', 'hubspot_team_id', 'hs_all_team_ids', 'subject', 'hs_lastactivitydate'];

var _getUrl = function _getUrl(pipelineId) {
  return "sales-views/v1/pipelines/TICKET/" + encodeURIComponent(pipelineId);
};

var increment = function increment(a) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return a + amount;
};

var decrement = function decrement(a) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return a - amount;
};

export var removeFromStage = function removeFromStage(pipelineData, ticket, stage) {
  return pipelineData.withMutations(function (pipeline) {
    pipeline.updateIn(['items', stage], function (fromItems) {
      var index = fromItems.indexOf(ticket);

      if (index !== -1) {
        fromItems = fromItems.delete(index);
      }

      return fromItems;
    }).updateIn(['count', stage], decrement).update('total', decrement);
  });
};
export var addToStage = function addToStage(pipelineData, ticket, stage) {
  var toIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return pipelineData.withMutations(function (pipeline) {
    pipeline.updateIn(['items', stage], function (toItems) {
      return toItems.insert(toIndex, ticket);
    }).updateIn(['count', stage], increment).update('total', increment);
  });
};
export var reconcile = function reconcile(pipeline, ticket, fromStage, toStage) {
  var toIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var fromItems = pipeline.getIn(['items', fromStage]);
  var index = toIndex != null ? toIndex : fromItems.indexOf(ticket);

  if (toStage && pipeline.hasIn(['items', toStage])) {
    var isAlreadyInStage = pipeline.getIn(['items', toStage]).find(function (item) {
      return get('objectId', item) === get('objectId', ticket);
    });

    if (!isAlreadyInStage) {
      pipeline = addToStage(pipeline, ticket, toStage, 0, index);
    }
  }

  return removeFromStage(pipeline, ticket, fromStage);
};
export var normalize = function normalize(stages) {
  var results = ImmutableMap({
    columns: List(),
    items: ImmutableMap(),
    count: ImmutableMap(),
    aggregation: ImmutableMap(),
    total: 0
  });
  var duplicates = [];
  var stale = [];
  stages.forEach(function (stage) {
    var stageId = stage.getIn(['stage', 'stageId']);
    var count = stage.get('count');
    var ticketsSeen = {};
    var tickets = stage.get('objects').map(function (ticket) {
      var record = TicketRecord.fromJS(ticket);
      var ticketStage = getIn(['properties', 'hs_pipeline_stage', 'value'], ticket);
      var ticketId = get('objectId', ticket);

      if (ticketsSeen[ticketId]) {
        duplicates.push({
          ticket: record,
          fromStage: ticketStage
        });
      } else {
        ticketsSeen[ticketId] = record;
      }

      if (ticketStage !== stageId) {
        stale.push({
          ticket: record,
          toStage: ticketStage,
          fromStage: stageId
        });
      }

      return record;
    });
    results = results.set('columns', results.get('columns').push(stage.get('stage').set('value', stageId))).set('total', results.get('total') + count).setIn(['items', stageId], tickets).setIn(['count', stageId], count).setIn(['aggregation', stageId], stage.get('amount'));
  });

  if (window.newrelic && (duplicates.length > 0 || stale.length > 0)) {
    window.newrelic.addPageAction('crmBoardReconcile', {
      type: TICKET,
      hasDuplicates: duplicates.length > 0,
      hasStale: stale.length > 0
    });
  }

  stale.forEach(function (_ref) {
    var ticket = _ref.ticket,
        fromStage = _ref.fromStage,
        toStage = _ref.toStage;
    results = reconcile(results, ticket, fromStage, toStage);
  });
  duplicates.forEach(function (_ref2) {
    var ticket = _ref2.ticket,
        fromStage = _ref2.fromStage;
    results = reconcile(results, ticket, fromStage);
  });
  return results;
};
export var search = function search(searchQuery, pipelineId) {
  if (pipelineId === undefined || pipelineId === null) {
    pipelineId = '0';
  }

  if (!searchQuery) {
    return null;
  }

  searchQuery = searchQuery.toJS();
  searchQuery.filterGroups = searchQuery.filterGroups.map(function (filterGroup) {
    filterGroup.filters = replaceSpecialTypes(filterGroup.filters);
    return filterGroup;
  });
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