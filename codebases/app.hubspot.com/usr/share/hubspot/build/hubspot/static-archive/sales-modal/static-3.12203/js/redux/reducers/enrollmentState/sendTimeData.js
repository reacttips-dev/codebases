'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import { ENROLLMENT_SEND_TIMES_FETCH_SUCCEEDED, SEND_LIMITS_FETCH_SUCCEEDED, RECOMMENDED_SEND_TIMES_FETCH_SUCCEEDED } from '../../actionTypes';
var initialState = fromJS({
  errors: {},
  sendLimits: {},
  recommendedSendTimes: []
});
export default function sendTimeData() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ENROLLMENT_SEND_TIMES_FETCH_SUCCEEDED:
      {
        var stepSendTimesResponses = action.payload.get('stepSendTimesResponses');

        if (!stepSendTimesResponses) {
          return initialState;
        }

        var stepsWithErrors = action.payload.get('stepSendTimesResponses').filter(function (step) {
          return step.get('numTimesNotAvailable');
        });

        if (!stepsWithErrors.size) {
          return state.set('errors', ImmutableMap());
        }

        var errorMappedToStep = stepsWithErrors.reduce(function (acc, step) {
          return acc.set(step.get('stepOrder'), step.get('timesNotAvailableReason'));
        }, ImmutableMap());
        return state.set('errors', errorMappedToStep);
      }

    case SEND_LIMITS_FETCH_SUCCEEDED:
      return state.set('sendLimits', action.payload);

    case RECOMMENDED_SEND_TIMES_FETCH_SUCCEEDED:
      return state.set('recommendedSendTimes', action.payload);

    default:
      return state;
  }
}