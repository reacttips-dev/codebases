'use es6';

import { List } from 'immutable';
import emptyFunction from 'react-utils/emptyFunction';
import isObject from 'transmute/isObject';
import protocol from 'transmute/protocol';
export var getDefaults = protocol({
  name: 'getDefaults',
  args: [protocol.TYPE],
  fallback: emptyFunction.thatReturns(List())
});
export var getFavorites = protocol({
  name: 'getFavorites',
  args: [protocol.TYPE],
  fallback: emptyFunction.thatReturns(List())
});
export var isPriorityFilter = protocol({
  name: 'isPriorityFilter',
  args: [protocol.TYPE, isObject],
  fallback: emptyFunction.thatReturns(false)
});