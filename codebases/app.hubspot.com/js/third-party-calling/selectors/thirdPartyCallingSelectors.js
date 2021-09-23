'use es6';

import getIn from 'transmute/getIn';
import { READY, LOADING } from '../constants/ThirdPartyStatus';
import { createSelector } from 'reselect';
var getThirdPartyCalling = getIn(['thirdPartyCalling']);
export var getThirdPartyCallingStatus = createSelector([getThirdPartyCalling], getIn(['status']));
export var getIsThirdPartyCallingReady = createSelector([getThirdPartyCallingStatus], function (status) {
  return status === READY;
});
export var getIsThirdPartyCallingLoading = createSelector([getThirdPartyCallingStatus], function (status) {
  return status === LOADING;
});
export var getIsLoggedInToThirdParty = createSelector([getThirdPartyCalling], getIn(['isLoggedIn']));