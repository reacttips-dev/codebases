'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useState } from 'react';
import getTrialState from 'self-service-api/api/getTrialState';
import ApiNameToUpgradeProductMap from 'self-service-api/constants/ApiNameToUpgradeProductMap';
export var useMultiTrialTrackingProps = function useMultiTrialTrackingProps() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      activeTrials = _useState2[0],
      setActiveTrials = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      expiredTrials = _useState4[0],
      setExpiredTrials = _useState4[1];

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      isMultiTrial = _useState6[0],
      setIsMultiTrial = _useState6[1];

  useEffect(function () {
    getTrialState().then(function (trialState) {
      var trialMap = Object.keys(trialState).reduce(function (acc, apiName) {
        var trial = trialState[apiName];
        var upgradeProduct = ApiNameToUpgradeProductMap[apiName];

        if (trial.inTrial) {
          acc.expiredTrials.push(upgradeProduct);
        } else {
          acc.activeTrials.push(upgradeProduct);
        }

        return acc;
      }, {
        activeTrials: [],
        expiredTrials: []
      });
      setActiveTrials(trialMap.activeTrials);
      setExpiredTrials(trialMap.expiredTrials);
      setIsMultiTrial(trialMap.activeTrials.length > 1);
    });
  }, []);
  var isLoadingTrackingProps = [isMultiTrial, activeTrials, expiredTrials].some(function (item) {
    return item === null;
  });
  return {
    activeTrials: activeTrials,
    expiredTrials: expiredTrials,
    isMultiTrial: isMultiTrial,
    isLoadingTrackingProps: isLoadingTrackingProps
  };
};