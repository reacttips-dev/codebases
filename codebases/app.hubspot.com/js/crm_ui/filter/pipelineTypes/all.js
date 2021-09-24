'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _clients;

import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { Map as ImmutableMap } from 'immutable';
import Deals from './Deals';
import Tickets from './Tickets';
import emptyFunction from 'react-utils/emptyFunction';
import invariant from 'react-utils/invariant';
var defaults = {
  getDefaultPipeline: emptyFunction,
  getPipelines: emptyFunction.thatReturns(ImmutableMap()),
  getPipelineSelectOptions: emptyFunction.thatReturnsArgument,
  savePipelineSettings: emptyFunction
};

var build = function build(Client) {
  return Object.assign({}, defaults, {}, Client);
};

var clients = (_clients = {}, _defineProperty(_clients, DEAL, build(Deals)), _defineProperty(_clients, TICKET, build(Tickets)), _clients);

var invoke = function invoke(objectType, fn) {
  var client = clients[objectType];
  invariant(client != null, "[PipelineSelector::invoke] Expected objectType of DEAL|TICKET, got: " + objectType);
  invariant(typeof client[fn] === 'function', "[PipelineSelector::invoke] Expected " + objectType + " to implement function " + fn + ", got: " + client[fn]);

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return client[fn].apply(client, args);
};

export var PIPELINE_ID_ALL = 'ALL';
export var allPipelineStores = [Deals.store, Tickets.store];
export default {
  getDefaultPipeline: function getDefaultPipeline(objectType) {
    return invoke(objectType, 'getDefaultPipeline');
  },
  getPipelines: function getPipelines(objectType) {
    return invoke(objectType, 'getPipelines');
  },
  getPipelineSelectOptions: function getPipelineSelectOptions(objectType, options) {
    return invoke(objectType, 'getPipelineSelectOptions', options);
  },
  savePipelineSettings: function savePipelineSettings(objectType, pipelineId) {
    return invoke(objectType, 'savePipelineSettings', pipelineId);
  }
};