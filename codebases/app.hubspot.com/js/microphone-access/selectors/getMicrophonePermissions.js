'use es6';

import get from 'transmute/get';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { isStarted, isFailed } from 'conversations-async-data/async-data/operators/statusComparators';
import { createSelector } from 'reselect';
import { CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import { getSelectedCallMethodFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
export var getMicrophonePermissionsFromState = get('microphonePermissions');
export var getMicrophonePermissionsStateFromState = createSelector([getMicrophonePermissionsFromState], function (microphonePermissions) {
  return getData(microphonePermissions);
});
export var getHasMicrophoneAccessFromState = createSelector([getMicrophonePermissionsFromState], function (microphonePermissions) {
  return getData(microphonePermissions) === 'granted';
});
export var getIsMicrophoneAccessLoadingFromState = createSelector([getMicrophonePermissionsFromState, getSelectedCallMethodFromState], function (microphonePermissions, selectedCallMethod) {
  return selectedCallMethod === CALL_FROM_BROWSER && isStarted(microphonePermissions);
});
export var getIsMicrophoneAccessDeniedFromState = createSelector([getMicrophonePermissionsFromState], function (microphonePermissions) {
  return getData(microphonePermissions) === 'denied' || isFailed(microphonePermissions);
});