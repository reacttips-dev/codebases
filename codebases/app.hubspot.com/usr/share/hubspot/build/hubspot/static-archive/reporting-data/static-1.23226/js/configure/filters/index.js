'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _mutators;

import { Iterable, List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { reduce } from '../../lib/async';
import { MY_USER_ID, MY_OWNER_ID, MY_TEAM_ID, CURRENT_TIME, CLOSEDWON_STAGES, SELECT_TOP } from '../../constants/magicTypes';
import userId from './userId';
import ownerId from './ownerId';
import teamId from './teamId';
import closedWonStageIds from './closedWonStageIds';
import currentTime from './currentTime';
import selectTopFilters from './selectTopFilters';
var mutators = (_mutators = {}, _defineProperty(_mutators, MY_USER_ID, userId), _defineProperty(_mutators, MY_OWNER_ID, ownerId), _defineProperty(_mutators, MY_TEAM_ID, teamId), _defineProperty(_mutators, CLOSEDWON_STAGES, closedWonStageIds), _defineProperty(_mutators, CURRENT_TIME, currentTime), _defineProperty(_mutators, SELECT_TOP, selectTopFilters), _mutators);

var getPaths = function getPaths(filters) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var found = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();
  return filters.reduce(function (memo, filter, key) {
    return Iterable.isIterable(filter) ? getPaths(filter, [].concat(_toConsumableArray(path), [key]), memo) : mutators.hasOwnProperty(filter) ? memo.update(filter, function () {
      var paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
      return paths.add([].concat(_toConsumableArray(path), [key]));
    }) : memo;
  }, found);
};

export default (function (config) {
  var filters = config.get('filters') || new List();
  var paths = getPaths(filters);
  return paths.isEmpty() ? config : reduce(paths, function (mutated, value, key) {
    return mutators[key](mutated, value);
  }, config);
});