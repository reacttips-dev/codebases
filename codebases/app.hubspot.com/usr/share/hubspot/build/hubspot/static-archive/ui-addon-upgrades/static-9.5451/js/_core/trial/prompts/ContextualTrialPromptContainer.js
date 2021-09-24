'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getIsAdmin } from '../../common/eligibility/getIsAdmin';
import Raven from 'Raven';
import { ContextualPromptConfig } from '../../common/constants/trials';
import ContextualTrialPrompt from './ContextualTrialPrompt';
import { getUserAttributes, setUserAttribute } from '../../common/eligibility/getUserAttributes';
import ErrorBoundary from '../../../ErrorBoundary';
import { useMultiTrialTrackingProps } from '../useMultiTrialTrackingProps';
var USER_SETTING_KEY = 'trials:contextual-prompts';

var getAppSettingsKey = function getAppSettingsKey(upgradeProduct, app) {
  return upgradeProduct + "-" + app;
}; // Returns the upgrade product of the first active trial that gives access to the given `app`
// or undefined if no such trial.


var getActiveTrialUpgradeProduct = function getActiveTrialUpgradeProduct(app, activeTrials) {
  var eligibleUpgradeProducts = Object.keys(ContextualPromptConfig);
  return eligibleUpgradeProducts.find(function (upgradeProduct) {
    var existsPromptForApp = !!ContextualPromptConfig[upgradeProduct][app];
    return existsPromptForApp && activeTrials.includes(upgradeProduct);
  });
};

var ContextualTrialPromptContainer = function ContextualTrialPromptContainer(_ref) {
  var app = _ref.app;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      showPrompt = _useState2[0],
      setShowPrompt = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      upgradeProduct = _useState4[0],
      setUpgradeProduct = _useState4[1];

  var _useMultiTrialTrackin = useMultiTrialTrackingProps(),
      activeTrials = _useMultiTrialTrackin.activeTrials,
      expiredTrials = _useMultiTrialTrackin.expiredTrials,
      isMultiTrial = _useMultiTrialTrackin.isMultiTrial,
      isLoadingTrackingProps = _useMultiTrialTrackin.isLoadingTrackingProps;

  useEffect(function () {
    if (isLoadingTrackingProps) {
      return;
    }

    Promise.all([getIsAdmin(), getUserAttributes(USER_SETTING_KEY)]).then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          isAdmin = _ref3[0],
          userAttributes = _ref3[1];

      var activeTrialUpgradeProduct = getActiveTrialUpgradeProduct(app, activeTrials);
      var isInTrial = !!activeTrialUpgradeProduct;
      var appSettingsKey = getAppSettingsKey(activeTrialUpgradeProduct, app);
      var promptViews = JSON.parse(userAttributes[0] && userAttributes[0].value || '{}');
      var hasPreviouslyViewedPrompt = !!promptViews[appSettingsKey];
      var shouldShowPrompt = !hasPreviouslyViewedPrompt && isAdmin && isInTrial;
      setUpgradeProduct(activeTrialUpgradeProduct);
      setShowPrompt(shouldShowPrompt);

      if (shouldShowPrompt) {
        setUserAttribute(USER_SETTING_KEY, JSON.stringify(Object.assign({}, promptViews, _defineProperty({}, appSettingsKey, true))));
      }
    }).catch(function (error) {
      Raven.captureMessage('Failed to fetch trial status', {
        extra: {
          error: error
        }
      });
    });
  }, [activeTrials, app, isLoadingTrackingProps]);
  if (!showPrompt || isLoadingTrackingProps) return null;
  return /*#__PURE__*/_jsx(ErrorBoundary, {
    boundaryName: "TrialsContextualPrompt",
    children: /*#__PURE__*/_jsx(ContextualTrialPrompt, {
      app: app,
      activeTrials: activeTrials,
      expiredTrials: expiredTrials,
      isMultiTrial: isMultiTrial,
      upgradeProduct: upgradeProduct,
      setShowPrompt: setShowPrompt
    })
  });
};

export default ContextualTrialPromptContainer;