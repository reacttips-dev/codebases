'use es6';

import get from 'transmute/get';
import { getSelectedCallableObjectFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { createSelector } from 'reselect';
import { getIsOptedOutOfCommunications } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
export var getGDPRBypass = get('gdprBypass');
export var getBypassGDPRFromState = createSelector([getSelectedCallableObjectFromState, getGDPRBypass], function (selectedCallableObject, bypass) {
  return Boolean(bypass.get(selectedCallableObject));
});
export var shouldShowGDPRMessage = createSelector([getBypassGDPRFromState, getSelectedCallableObjectFromState], function (isGDPRBypassed, selectedCallableObject) {
  var isOptedOut = getIsOptedOutOfCommunications(selectedCallableObject);
  return Boolean(!isGDPRBypassed && isOptedOut);
});