'use es6';

import { createSelector } from 'reselect';
import { getVisitorIdentity } from './getVisitorIdentity';
import { getGlobalCookieOptOut as getGlobalCookieOptOutOperator } from '../operators/getGlobalCookieOptOut';
export var getGlobalCookieOptOut = createSelector(getVisitorIdentity, function (visitorIdentity) {
  return getGlobalCookieOptOutOperator(visitorIdentity) === 'yes';
});