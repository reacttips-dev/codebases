'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import Banner from '../Banner';
import ContactSalesButton from '../ContactSalesButton';
import PricingPageButton from '../PricingPageButton';
import TrialBannerTitle from '../TrialBannerTitle';
import styled from 'styled-components';
import UICloseButton from 'UIComponents/button/UICloseButton';
import { EXPIRED_BANNER_TYPES } from '../BannerTypes';
import PropTypes from 'prop-types';
import MultiTrialDropdown from '../MultiTrialDropdown';
var EXPIRED_MARKETING_PRO = EXPIRED_BANNER_TYPES.EXPIRED_MARKETING_PRO,
    EXPIRED_TALK_TO_SALES = EXPIRED_BANNER_TYPES.EXPIRED_TALK_TO_SALES,
    EXPIRED_INTERNAL = EXPIRED_BANNER_TYPES.EXPIRED_INTERNAL,
    EXPIRED_OPERATIONS_PROFESSIONAL = EXPIRED_BANNER_TYPES.EXPIRED_OPERATIONS_PROFESSIONAL;
var ButtonContainer = styled.div.withConfig({
  displayName: "ExpiredBanner__ButtonContainer",
  componentId: "xt0ee5-0"
})(["position:relative;width:40px;height:40px;"]);
var CloseButton = styled(UICloseButton).withConfig({
  displayName: "ExpiredBanner__CloseButton",
  componentId: "xt0ee5-1"
})(["top:12px;right:12px;"]);

var ExpiredBanner = function ExpiredBanner(_ref) {
  var bannerType = _ref.bannerType,
      onChangePreferredTrial = _ref.onChangePreferredTrial,
      onClose = _ref.onClose,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct,
      upgradeData = _ref.upgradeData;
  var renderedTitle = useMemo(function () {
    return /*#__PURE__*/_jsx(TrialBannerTitle, {
      message: "trial-banner-ui.headerExpired",
      preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
    });
  }, [preferredTrialUpgradeProduct]);
  var renderedButton = useMemo(function () {
    return /*#__PURE__*/_jsx(ButtonContainer, {
      children: /*#__PURE__*/_jsx(CloseButton, {
        onClick: onClose
      })
    });
  }, [onClose]);
  var renderedMultiTrialDropdown = useMemo(function () {
    return /*#__PURE__*/_jsx(MultiTrialDropdown, {
      onChangePreferredTrial: onChangePreferredTrial,
      preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
    });
  }, [onChangePreferredTrial, preferredTrialUpgradeProduct]);

  switch (bannerType) {
    case EXPIRED_MARKETING_PRO:
    case EXPIRED_TALK_TO_SALES:
      return /*#__PURE__*/_jsxs(Banner, {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex-grow-1",
          children: [renderedTitle, /*#__PURE__*/_jsx(FormattedMessage, {
            message: "trial-banner-ui.haveQuestions"
          }), /*#__PURE__*/_jsx(ContactSalesButton, {
            upgradeData: upgradeData
          })]
        }), renderedMultiTrialDropdown, renderedButton]
      });

    case EXPIRED_OPERATIONS_PROFESSIONAL:
      return /*#__PURE__*/_jsxs(Banner, {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex-grow-1",
          children: [renderedTitle, /*#__PURE__*/_jsx(PricingPageButton, {
            upgradeData: upgradeData
          })]
        }), renderedMultiTrialDropdown, renderedButton]
      });

    case EXPIRED_INTERNAL:
      return /*#__PURE__*/_jsxs(Banner, {
        children: [/*#__PURE__*/_jsx("div", {
          className: "flex-grow-1",
          children: renderedTitle
        }), renderedButton, renderedMultiTrialDropdown]
      });

    default:
      return null;
  }
};

ExpiredBanner.propTypes = {
  bannerType: PropTypes.oneOf(Object.keys(EXPIRED_BANNER_TYPES)).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangePreferredTrial: PropTypes.func,
  preferredTrialUpgradeProduct: PropTypes.string.isRequired,
  upgradeData: PropTypes.object.isRequired
};
export default ExpiredBanner;