'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useContext, useCallback, useMemo, createContext } from 'react';
import ContextualFlydown from './ContextualFlydown';
import TrialBanner from './TrialBanner';
import { FlydownContext } from './FlydownContext';
import { postMessage, verifyEvent } from './utils';
import { NavMarker } from 'react-rhumb';
import { useMaybeAutoExpandFlydown } from './useMaybeAutoExpandFlydown';
import { usePortalSettings } from './usePortalSettings';
import SwitchTrialViewPopover from './SwitchTrialViewPopover';
import { isAdmin } from 'ui-addon-upgrades/_core/common/eligibility/getIsAdmin';
import { tracker, getCommonTrackingProperties, syncTracker } from './tracker';
import { frameProps, isTrialActive } from './queryParamUtils';
import { MultiTrialDropdownContext } from './contexts/MultiTrialDropdownContext';
import { useUserInfo } from './useUserInfo';
import { useForwardSalesChatEvent } from './utils/zorseWidgetUtils';
import AlertWrapper from './utils/AlertWrapper';
import { useIsUngated } from './useIsUngated';
export var TrialStateContext = /*#__PURE__*/createContext();

function App() {
  var _useContext = useContext(FlydownContext),
      showFlydown = _useContext.showFlydown,
      setShowFlydown = _useContext.setShowFlydown;

  var _useContext2 = useContext(MultiTrialDropdownContext),
      setShowMultiTrialDropdown = _useContext2.setShowMultiTrialDropdown,
      setSwitchTrialViewRef = _useContext2.setSwitchTrialViewRef,
      switchTrialViewRef = _useContext2.switchTrialViewRef;

  var _useState = useState(frameProps.trialBannerState),
      _useState2 = _slicedToArray(_useState, 2),
      trialState = _useState2[0],
      setTrialState = _useState2[1];

  var _useState3 = useState(frameProps.preferredTrial || {}),
      _useState4 = _slicedToArray(_useState3, 2),
      preferredTrial = _useState4[0],
      setPreferredTrial = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      hasTrackedPageView = _useState6[0],
      setHasTrackedPageView = _useState6[1];

  useEffect(function () {
    window.addEventListener('message', function (event) {
      if (verifyEvent(window.parent, event)) {
        if (event.data === 'FLYDOWN_CLOSE') {
          postMessage('FLYDOWN_CLOSE');
          setShowFlydown(false);
          setShowMultiTrialDropdown(false); // Dismiss MultiTrialDropdown when user clicks outside of banner iframe

          setSwitchTrialViewRef(null); // Dismiss "switch trial views" popover when user clicks outside of banner iframe
        }
      }
    });
  }, [setShowFlydown, switchTrialViewRef, setSwitchTrialViewRef, setShowMultiTrialDropdown]); /// for tts chat event capture

  useForwardSalesChatEvent();
  var productApiName = preferredTrial.productApiName,
      expiresAt = preferredTrial.expiresAt,
      upgradeProduct = preferredTrial.trialName;
  var activeTrials = useMemo(function () {
    if (!trialState) {
      return [];
    }

    return trialState.filter(function (trial) {
      return isTrialActive(trial.status);
    });
  }, [trialState]);
  var expiredTrials = useMemo(function () {
    if (!trialState) {
      return [];
    }

    return trialState.filter(function (trial) {
      return !isTrialActive(trial.status);
    });
  }, [trialState]);
  var isMultiTrial = activeTrials.length > 1;
  var userInfo = useUserInfo();
  var isUngatedForBannerPortals = useIsUngated('Trials:BannerPortals');
  useEffect(function () {
    if (productApiName && expiresAt && upgradeProduct && isMultiTrial !== null) {
      tracker.setProperties(getCommonTrackingProperties({
        activeTrials: activeTrials,
        apiName: productApiName,
        expiredTrials: expiredTrials,
        expiresAt: expiresAt,
        upgradeProduct: upgradeProduct,
        isMultiTrial: isMultiTrial
      }));
      syncTracker.setProperties(getCommonTrackingProperties({
        activeTrials: activeTrials,
        apiName: productApiName,
        expiredTrials: expiredTrials,
        expiresAt: expiresAt,
        upgradeProduct: upgradeProduct,
        isMultiTrial: isMultiTrial
      }));
    }

    if (!hasTrackedPageView && trialState && userInfo) {
      // de-abstract isAdmin call so we can track whether the data has been fetched
      var userIsAdmin = !!(userInfo && isAdmin(userInfo));
      tracker.setProperties({
        isAdmin: userIsAdmin
      });
      tracker.track('pageView');
      postMessage('FRAME_READY');
      setHasTrackedPageView(true);
    }
  }, [productApiName, expiresAt, upgradeProduct, isMultiTrial, activeTrials, expiredTrials, hasTrackedPageView, trialState, userInfo]);
  var portalSettings = usePortalSettings(showFlydown);
  var handleShowFlydownClick = useCallback(function () {
    setShowMultiTrialDropdown(false);

    if (!showFlydown) {
      postMessage('FLYDOWN_OPEN');
      setShowFlydown(true);
    } else {
      setShowFlydown(false);
      postMessage('FLYDOWN_CLOSE');
    }
  }, [showFlydown, setShowFlydown, setShowMultiTrialDropdown]);

  var renderFlydown = function renderFlydown() {
    if (!showFlydown) return null;
    return /*#__PURE__*/_jsx(ContextualFlydown, {
      preferredTrialUpgradeProduct: upgradeProduct,
      onToggleFlydown: handleShowFlydownClick
    });
  };

  useMaybeAutoExpandFlydown(portalSettings, handleShowFlydownClick); // Some flows require the flydown to be open upon first visit

  var hasFetchedAllNeededInfoForTracking = !!(upgradeProduct && userInfo);
  var isLoadingGate = isUngatedForBannerPortals === null;

  if (!hasFetchedAllNeededInfoForTracking || isLoadingGate) {
    return null;
  }

  return /*#__PURE__*/_jsxs("div", {
    "data-test-id": "trial-banner",
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "BANNER_LOAD"
    }), /*#__PURE__*/_jsx(AlertWrapper, {
      children: /*#__PURE__*/_jsxs(TrialStateContext.Provider, {
        value: {
          trialState: trialState,
          onChangeTrialState: setTrialState,
          preferredTrial: preferredTrial,
          onChangePreferredTrial: setPreferredTrial
        },
        children: [/*#__PURE__*/_jsx(TrialBanner, {
          onShowFlydownClick: handleShowFlydownClick,
          showFlydown: showFlydown
        }), renderFlydown(), /*#__PURE__*/_jsx(SwitchTrialViewPopover, {
          showFlydown: showFlydown
        })]
      })
    })]
  });
}

export default App;