'use es6';

import { TrialsApi } from 'self-service-api/core/api/trialApi';
import { trialStateAdapter } from 'self-service-api/adapters/trialStateAdapter';

var getTrialState = function getTrialState() {
  return TrialsApi.getTrialState().then(function (trialState) {
    return trialStateAdapter(trialState);
  });
};

export default getTrialState;