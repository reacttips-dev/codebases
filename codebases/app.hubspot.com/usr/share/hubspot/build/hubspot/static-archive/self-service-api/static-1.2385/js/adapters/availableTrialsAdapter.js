'use es6';

var availableTrialsAdapter = function availableTrialsAdapter(availableTrials) {
  return availableTrials.map(function (trial) {
    var firstTrialParcel = trial.parcels && trial.parcels.length ? trial.parcels[0] : null;
    return {
      name: trial.name,
      trialId: trial.id,
      apiName: firstTrialParcel && firstTrialParcel.productApiName || null
    };
  });
};

export default availableTrialsAdapter;