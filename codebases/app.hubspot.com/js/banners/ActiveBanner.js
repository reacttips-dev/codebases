'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _this = this;

import { useMemo } from 'react';
import { syncTracker, tracker } from '../tracker';
import ShowContextFeaturesButton from '../ShowContextFeaturesButton';
import MultiTrialDropdown from '../MultiTrialDropdown';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PortalIdParser from 'PortalIdParser';
import UILink from 'UIComponents/link/UILink';
import Banner from '../Banner';
import ContactSalesButton from '../ContactSalesButton';
import PricingPageButton from '../PricingPageButton';
import ShowFeaturesButton from '../ShowFeaturesButton';
import TrialBannerTitle from '../TrialBannerTitle';
import { useCallback } from 'react';
import { ACTIVE_BANNER_TYPES } from '../BannerTypes';
import { getAppContext } from '../queryParamUtils';
import PropTypes from 'prop-types';
import { MARKETING_PRO } from 'self-service-api/constants/UpgradeProducts';
import { postMessage } from '../utils';
var ACTIVE_MARKETING_PRO = ACTIVE_BANNER_TYPES.ACTIVE_MARKETING_PRO,
    ACTIVE_SALES_PROFESSIONAL = ACTIVE_BANNER_TYPES.ACTIVE_SALES_PROFESSIONAL,
    ACTIVE_OPERATIONS_PROFESSIONAL = ACTIVE_BANNER_TYPES.ACTIVE_OPERATIONS_PROFESSIONAL,
    ACTIVE_TALK_TO_SALES = ACTIVE_BANNER_TYPES.ACTIVE_TALK_TO_SALES,
    ACTIVE_INTERNAL = ACTIVE_BANNER_TYPES.ACTIVE_INTERNAL;

var ActiveBanner = function ActiveBanner(_ref) {
  var bannerType = _ref.bannerType,
      onChangePreferredTrial = _ref.onChangePreferredTrial,
      onShowFlydownClick = _ref.onShowFlydownClick,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct,
      showFlydown = _ref.showFlydown,
      upgradeData = _ref.upgradeData;
  var appContext = getAppContext(preferredTrialUpgradeProduct);
  var handleShowFlydownClick = useCallback(function (upgradeProduct, ignoreAppContext) {
    var action = upgradeProduct === MARKETING_PRO ? 'showMarketingFeaturesFlydown' : 'showFeaturesFlydown';

    if ((ignoreAppContext || !appContext) && !showFlydown) {
      tracker.track('interaction', {
        action: action
      });
    }

    onShowFlydownClick();
  }, [appContext, onShowFlydownClick, showFlydown]);
  var handleTrialGuideClick = useCallback(function () {
    syncTracker.track('interaction', {
      action: 'clicked go to trial guide link'
    });
    postMessage('REDIRECT', {
      href: "/trial-guide/" + PortalIdParser.get() + "/" + preferredTrialUpgradeProduct + "?source=trial-banner"
    });
  }, [preferredTrialUpgradeProduct]);
  var renderedMultiTrialDropdown = useMemo(function () {
    return /*#__PURE__*/_jsx(MultiTrialDropdown, {
      onChangePreferredTrial: onChangePreferredTrial,
      preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
    });
  }, [onChangePreferredTrial, preferredTrialUpgradeProduct]);
  var renderedTitle = useMemo(function () {
    return /*#__PURE__*/_jsx(TrialBannerTitle, {
      message: "trial-banner-ui.header",
      preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
    });
  }, [preferredTrialUpgradeProduct]);

  switch (bannerType) {
    case ACTIVE_SALES_PROFESSIONAL:
    case ACTIVE_MARKETING_PRO:
      return /*#__PURE__*/_jsxs(Banner, {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex-grow-1",
          children: [renderedTitle, /*#__PURE__*/_jsx(UILink, {
            onClick: handleTrialGuideClick,
            use: "on-dark",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "trial-banner-ui.goToGuide"
            })
          }), /*#__PURE__*/_jsx(ContactSalesButton, {
            upgradeData: upgradeData
          })]
        }), renderedMultiTrialDropdown, appContext ? /*#__PURE__*/_jsx(ShowContextFeaturesButton, {
          appContext: appContext,
          showFlydown: showFlydown,
          onClick: handleShowFlydownClick
        }) : /*#__PURE__*/_jsx(ShowFeaturesButton, {
          onClick: handleShowFlydownClick,
          showFlydown: showFlydown
        })]
      });

    case ACTIVE_OPERATIONS_PROFESSIONAL:
      return /*#__PURE__*/_jsxs(Banner, {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex-grow-1",
          children: [renderedTitle, /*#__PURE__*/_jsx(PricingPageButton, {
            upgradeData: upgradeData
          })]
        }), renderedMultiTrialDropdown, /*#__PURE__*/_jsx(ShowFeaturesButton, {
          showFlydown: showFlydown,
          onClick: handleShowFlydownClick.bind(_this, undefined, true)
        })]
      });

    case ACTIVE_TALK_TO_SALES:
      return /*#__PURE__*/_jsxs(Banner, {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex-grow-1",
          children: [renderedTitle, /*#__PURE__*/_jsx(FormattedMessage, {
            message: "trial-banner-ui.haveQuestions"
          }), /*#__PURE__*/_jsx(ContactSalesButton, {
            upgradeData: upgradeData
          })]
        }), renderedMultiTrialDropdown, appContext ? /*#__PURE__*/_jsx(ShowContextFeaturesButton, {
          appContext: appContext,
          showFlydown: showFlydown,
          onClick: handleShowFlydownClick
        }) : /*#__PURE__*/_jsx(ShowFeaturesButton, {
          onClick: handleShowFlydownClick,
          showFlydown: showFlydown
        })]
      });

    case ACTIVE_INTERNAL:
      return /*#__PURE__*/_jsx(Banner, {
        children: renderedTitle
      });

    default:
      return null;
  }
};

ActiveBanner.propTypes = {
  bannerType: PropTypes.oneOf(Object.keys(ACTIVE_BANNER_TYPES)),
  onChangePreferredTrial: PropTypes.func,
  onShowFlydownClick: PropTypes.func,
  preferredTrialUpgradeProduct: PropTypes.string,
  showFlydown: PropTypes.bool,
  upgradeData: PropTypes.object.isRequired
};
export default ActiveBanner;