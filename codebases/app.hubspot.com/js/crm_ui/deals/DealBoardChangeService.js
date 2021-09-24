'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handlers;

import { Map as ImmutableMap } from 'immutable';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import registerService from 'crm_data/flux/registerService';
import DealBoardSearchActionTypes from '../board/deals/DealBoardSearchActionTypes';
import TicketBoardSearchActionTypes from '../board/tickets/TicketBoardSearchActionTypes';
import { ES_RESULT_MOVED, REVERT_DEAL_STAGE_MOVE, TICKET_STAGE_CHANGE_REVERT, DEALS_UPDATE_SUCCEEDED, TICKETS_UPDATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import ElasticSearchActions from '../flux/elasticSearch/ElasticSearchActions';
import DealBoardSearchActions from '../board/deals/DealBoardSearchActions';
import TicketBoardSearchActions from '../board/tickets/TicketBoardSearchActions';
var DEAL_MOVED = DealBoardSearchActionTypes.MOVED;
var TICKET_MOVED = TicketBoardSearchActionTypes.MOVED;

var getMoveHandler = function getMoveHandler(eventName) {
  return function (state, actionOptions) {
    var _actionOptions = actionOptions,
        id = _actionOptions.id;
    actionOptions = ImmutableMap(actionOptions);

    if (state.hasIn(["" + id, eventName])) {
      var originalStage = state.getIn(["" + id, eventName, 'from']);
      actionOptions = actionOptions.set('from', originalStage);
    }

    return state.setIn(["" + id, eventName], actionOptions);
  };
};

var getMoveSavedHandler = function getMoveSavedHandler(eventName) {
  return function (state, _ref) {
    var id = _ref.id;
    return state.deleteIn(["" + id, eventName]);
  };
};

var getMoveRevertedHandler = function getMoveRevertedHandler(eventName, handleMove) {
  return function (state, id) {
    var lastUpdate = state.get("" + id);

    if (!lastUpdate) {
      return state;
    }

    var esAction = lastUpdate.get(ES_RESULT_MOVED);
    var cardAction = lastUpdate.get(eventName);
    ElasticSearchActions.moveResult(esAction.objectType, esAction.toSearchQuery, esAction.fromSearchQuery, esAction.toViewId, esAction.fromViewId, esAction.id, esAction.toIndex);

    if (cardAction.get('to') === cardAction.get('from')) {
      return state;
    }

    handleMove.moveResult(cardAction.get('key'), cardAction.get('searchQuery'), cardAction.get('to'), cardAction.get('from'), cardAction.get('id'), cardAction.get('toIndex'));
    return state;
  };
};

var handlers = (_handlers = {}, _defineProperty(_handlers, DEAL_MOVED, getMoveHandler(DEAL_MOVED)), _defineProperty(_handlers, TICKET_MOVED, getMoveHandler(TICKET_MOVED)), _defineProperty(_handlers, ES_RESULT_MOVED, function (state, actionOptions) {
  var id = actionOptions.id,
      objectType = actionOptions.objectType;

  if (objectType !== DEAL && objectType !== TICKET) {
    return state;
  }

  return state.setIn(["" + id, ES_RESULT_MOVED], actionOptions);
}), _defineProperty(_handlers, DEALS_UPDATE_SUCCEEDED, getMoveSavedHandler(DEAL_MOVED)), _defineProperty(_handlers, TICKETS_UPDATE_SUCCEEDED, getMoveSavedHandler(TICKET_MOVED)), _defineProperty(_handlers, REVERT_DEAL_STAGE_MOVE, getMoveRevertedHandler(DEAL_MOVED, DealBoardSearchActions)), _defineProperty(_handlers, TICKET_STAGE_CHANGE_REVERT, getMoveRevertedHandler(TICKET_MOVED, TicketBoardSearchActions)), _handlers);
registerService(ImmutableMap(), handlers);