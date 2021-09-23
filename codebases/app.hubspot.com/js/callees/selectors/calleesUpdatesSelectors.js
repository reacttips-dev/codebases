'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import { getStatus } from 'conversations-async-data/async-data/operators/getters';
var getCalleesUpdates = getIn(['calleesUpdates']);
export var getCalleesUpdatesStatus = createSelector(getCalleesUpdates, getStatus);