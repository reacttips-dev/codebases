'use es6';

import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getEntries } from 'conversations-async-data/indexed-async-data/operators/getters';
import { AGENT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { createSelector } from 'reselect';
import filter from 'transmute/filter';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import { getType } from '../operators/responderKeyGetters';
import { getResponders } from './getResponders';
export var getAllAgentResponders = createSelector([getResponders], function (respondersAsyncData) {
  return pipe(getEntries, filter(function (__value, key) {
    return getType(key) === AGENT;
  }), map(getData))(respondersAsyncData);
});