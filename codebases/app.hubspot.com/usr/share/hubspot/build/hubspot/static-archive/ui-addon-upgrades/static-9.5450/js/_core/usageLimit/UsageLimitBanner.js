'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Fragment, useEffect } from 'react';
import { STARTER_CONTACTS } from 'self-service-api/constants/UpgradeProducts';
import { openNewTab } from 'ui-addon-upgrades/_core/common/navigation/url';
import { upgradeDataPropsInterface } from 'ui-addon-upgrades/_core/common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { getUpgradeLink } from 'ui-addon-upgrades/_core/common/adapters/getUpgradeLink';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { getUpgradeButtonText } from 'ui-addon-upgrades/_core/common/adapters/getUpgradeButtonText';
import BannerSubtext from '../common/components/banner/BannerSubtext';
import RequestSeatBannerWrapper from '../common/components/banner/RequestSeatBannerWrapper';
import { DefaultBanner } from '../common/components/banner/DefaultBanner';

var getIsSalesRepEngagementProduct = function getIsSalesRepEngagementProduct(feature) {
  return ['documents', 'templates', 'snippets'].includes(feature);
};

var TooltipWrapper = function TooltipWrapper(_ref) {
  var tooltipComponent = _ref.tooltipComponent;
  return /*#__PURE__*/_jsx(UITooltip, {
    use: "longform",
    maxWidth: 240,
    placement: "bottom",
    title: tooltipComponent,
    children: /*#__PURE__*/_jsx(UIIcon, {
      className: "m-left-2",
      name: "info"
    })
  });
};

export var UsageLimitBanner = function UsageLimitBanner(props) {
  var upgradeData = props.upgradeData,
      upgradeProduct = props.upgradeData.upgradeProduct,
      value = props.value,
      limit = props.limit,
      hasReachedLimit = props.hasReachedLimit,
      currencyCode = props.currencyCode,
      carouselItem = props.carouselItem,
      feature = props.feature,
      responsive = props.responsive,
      subType = props.subType,
      tooltipComponent = props.tooltipComponent;
  useEffect(function () {
    // ********** PUBLIC EVENT **********
    // Public Events help teams across HubSpot automate work and customize experiences based on user actions.
    // Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
    // Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation
    tracker.track('usageLimitInteraction', Object.assign({
      action: 'viewed',
      value: value,
      limit: limit,
      currencyCode: currencyCode,
      hasReachedLimit: hasReachedLimit
    }, upgradeData));
  }, [currencyCode, hasReachedLimit, limit, upgradeData, value]);

  var handleButtonClick = function handleButtonClick() {
    // ********** PUBLIC EVENT **********
    // Public Events help teams across HubSpot automate work and customize experiences based on user actions.
    // Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
    // Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation
    tracker.track('usageLimitInteraction', Object.assign({
      action: 'clicked upgrade',
      value: value,
      limit: limit,
      currencyCode: currencyCode,
      hasReachedLimit: hasReachedLimit
    }, upgradeData));
    openNewTab(getUpgradeLink(upgradeData));
  };

  var limitFeature = feature || carouselItem;
  var headerText = "upgrades.usageLimitBanner.header." + limitFeature;
  var titleTextCopy = I18n.text(subType ? headerText + "." + subType : headerText, {
    limit: limit,
    value: value,
    currencyCode: currencyCode
  });

  var titleText = /*#__PURE__*/_jsxs(Fragment, {
    children: [titleTextCopy, tooltipComponent && /*#__PURE__*/_jsx(TooltipWrapper, {
      tooltipComponent: tooltipComponent
    })]
  });

  var subText = upgradeData.upgradeProduct === STARTER_CONTACTS ? 'upgrades.usageLimitBanner.subtext.starter-contacts' : "upgrades.usageLimitBanner.subtext." + limitFeature; // This is a special case request from the Sales Rep Engagement team to show alternative
  // copy for the request/assign seat state.

  var requestSeatTitleText = getIsSalesRepEngagementProduct(limitFeature) ? I18n.text("upgrades.usageLimitBanner.header." + limitFeature + "Request", {
    limit: limit
  }) : titleTextCopy;
  return /*#__PURE__*/_jsx(RequestSeatBannerWrapper, Object.assign({}, props, {
    titleText: requestSeatTitleText,
    children: /*#__PURE__*/_jsx(DefaultBanner, Object.assign({}, props, {
      titleText: titleText,
      button: /*#__PURE__*/_jsx(UIButton, {
        className: "private-upgrades-message-button",
        size: "small",
        use: "primary-white",
        onClick: handleButtonClick,
        responsive: responsive,
        children: getUpgradeButtonText('default', upgradeProduct)
      }),
      subtext: /*#__PURE__*/_jsx(BannerSubtext, {
        subText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: subType ? subText + "." + subType : subText,
          options: {
            limit: limit,
            value: value
          }
        }),
        upgradeProduct: upgradeProduct
      })
    }))
  }));
};
UsageLimitBanner.defaultProps = {
  value: 0
};
UsageLimitBanner.propTypes = Object.assign({
  carouselItem: PropTypes.string,
  className: PropTypes.string,
  closeable: PropTypes.bool,
  condensed: PropTypes.bool,
  currencyCode: PropTypes.string,
  feature: PropTypes.string,
  hasReachedLimit: PropTypes.bool.isRequired,
  limit: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  responsive: PropTypes.bool,
  style: PropTypes.object,
  subType: PropTypes.string,
  tooltipComponent: PropTypes.node,
  value: PropTypes.number.isRequired
}, upgradeDataPropsInterface);