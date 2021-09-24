'use es6';

import UpgradeProductToApiNameMap from 'self-service-api/constants/UpgradeProductToApiNameMap';
import { buildTrialState } from 'self-service-api/core/utilities/trialUtils';
export var trialStateAdapter = function trialStateAdapter(trialState) {
  if (trialState.length === 0) return trialState;
  var transformedTrialState = {};
  trialState.forEach(function (hubTrial) {
    var trials = hubTrial.trials,
        createdAt = hubTrial.createdAt,
        endsAt = hubTrial.endsAt,
        removedAt = hubTrial.removedAt;
    trials.forEach(function (trial) {
      var name = trial.name,
          id = trial.id;
      var label = UpgradeProductToApiNameMap[name];
      transformedTrialState[label] = buildTrialState(createdAt, endsAt, removedAt, id);
    });
  });
  return transformedTrialState;
};