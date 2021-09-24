'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useContext, useState } from 'react';
import http from 'hub-http/clients/apiClient';
import { app, screen, determineTrialBannerType } from './queryParamUtils';
import { postMessage } from './utils';
import { localStorageRemove } from './localStorage';
import PropTypes from 'prop-types';
import Raven from 'Raven';
import ExpiredBanner from './banners/ExpiredBanner';
import ActiveBanner from './banners/ActiveBanner';
import { ACTIVE_BANNER_TYPES, EXPIRED_BANNER_TYPES } from './BannerTypes';
import { TrialStateContext } from './App';

function TrialBanner(_ref) {
  var onShowFlydownClick = _ref.onShowFlydownClick,
      showFlydown = _ref.showFlydown;

  var _useContext = useContext(TrialStateContext),
      trialState = _useContext.trialState,
      onChangeTrialState = _useContext.onChangeTrialState,
      preferredTrial = _useContext.preferredTrial,
      onChangePreferredTrial = _useContext.onChangePreferredTrial;

  var rawTrialName = preferredTrial.rawTrialName;

  var _useState = useState(determineTrialBannerType(preferredTrial)),
      _useState2 = _slicedToArray(_useState, 2),
      bannerType = _useState2[0],
      setBannerType = _useState2[1];

  var preferredTrialUpgradeProduct = preferredTrial.trialName;
  var upgradeData = {
    app: app,
    screen: screen,
    uniqueId: 'banner',
    upgradeProduct: preferredTrialUpgradeProduct
  };
  var handleClose = useCallback(function () {
    http.delete("/monetization-service/v3/trials/banner/" + rawTrialName // Use rawTrialName instead of trialName while the "cms" -> "cms-professional" FE hack is live
    );

    if (trialState.length > 1) {
      var newTrialState = trialState.slice(1);
      var nextPreferredTrial = trialState[1];
      onChangeTrialState(newTrialState);
      onChangePreferredTrial(nextPreferredTrial);
    } else {
      localStorageRemove('PLACEHOLDER_TRIAL_BANNER');
      postMessage('BANNER_CLOSE');
    }
  }, [rawTrialName, trialState, onChangeTrialState, onChangePreferredTrial]);
  var handleChangePreferredTrial = useCallback(function (trial) {
    var upgradeProduct = trial.rawTrialName;
    http.post("monetization-service/v3/trials/preferred/" + upgradeProduct).then(function () {
      var updatedBannerType = determineTrialBannerType(trial);
      setBannerType(updatedBannerType);
      onChangePreferredTrial(trial);
    }).catch(function (error) {
      Raven.captureMessage('Failed to update trial banner', {
        extra: {
          error: error,
          upgradeProduct: upgradeProduct
        }
      });
    });
  }, [onChangePreferredTrial]);

  if (ACTIVE_BANNER_TYPES[bannerType]) {
    return /*#__PURE__*/_jsx(ActiveBanner, {
      bannerType: bannerType,
      onChangePreferredTrial: handleChangePreferredTrial,
      onShowFlydownClick: onShowFlydownClick,
      preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
      showFlydown: showFlydown,
      upgradeData: upgradeData
    });
  }

  if (EXPIRED_BANNER_TYPES[bannerType]) {
    return /*#__PURE__*/_jsx(ExpiredBanner, {
      bannerType: bannerType,
      onClose: handleClose,
      onChangePreferredTrial: handleChangePreferredTrial,
      preferredTrialUpgradeProduct: preferredTrialUpgradeProduct,
      upgradeData: upgradeData
    });
  }

  return null;
}

TrialBanner.propTypes = {
  onShowFlydownClick: PropTypes.func.isRequired,
  showFlydown: PropTypes.bool
};
export default TrialBanner;