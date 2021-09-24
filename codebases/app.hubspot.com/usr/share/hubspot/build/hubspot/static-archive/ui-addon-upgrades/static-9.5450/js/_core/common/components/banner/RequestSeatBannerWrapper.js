'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { getPaidUserManagementUrl } from 'self-service-api/core/utilities/links';
import FormattedMessage from 'I18n/components/FormattedMessage';
import AdminModal from '../AdminModal';
import * as AdminModalTypes from '../../constants/AdminModalTypes';
import * as PurchaseMotionTypes from '../../../purchaseMotions/PurchaseMotionTypes';
import { getProductNameText } from '../../adapters/getProductNameText';
import { getSeatedPurchaseMotion } from '../../../utils/getSeatedPurchaseMotion';
import { sources } from '../../data/upgradeData/properties/sources';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import { getParsedProductPurchaseMotions } from 'ui-addon-upgrades/_core/common/data/purchaseMotionData/getParsedProductPurchaseMotions';
import { USAGE_LIMIT_BANNER } from 'ui-addon-upgrades/_core/common/constants/PurchaseMotionLocations';
import { SEATED_API_NAMES } from 'self-service-api/constants/ApiNameList';
import { DefaultBanner } from './DefaultBanner';
import UIButton from 'UIComponents/button/UIButton';
import UpgradeProductToApiNameMap from 'self-service-api/constants/UpgradeProductToApiNameMap';
export var RequestSeatBannerWrapper = function RequestSeatBannerWrapper(props) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isModalOpen = _useState2[0],
      setIsModalOpen = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      seatedPurchaseMotion = _useState4[0],
      setSeatedPurchaseMotion = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var isMounted = useRef(false);

  var children = props.children,
      upgradeProduct = props.upgradeData.upgradeProduct,
      upgradeData = props.upgradeData,
      responsive = props.responsive,
      propsToPass = _objectWithoutProperties(props, ["children", "upgradeData", "upgradeData", "responsive"]);

  var isAssignSeatBanner = seatedPurchaseMotion === PurchaseMotionTypes.ASSIGN_SEAT;
  var langKey = isAssignSeatBanner ? 'assignYourselfASeat' : 'requestSeatFromAdmin';

  var onClick = function onClick() {
    if (isAssignSeatBanner) {
      tracker.track('requestSeatBannerInteraction', Object.assign({
        banner: 'assign yourself a seat',
        action: 'clicked users and teams link',
        source: sources.USAGE_LIMIT
      }, upgradeData));
    } else {
      setIsModalOpen(true);
      tracker.track('requestSeatBannerInteraction', Object.assign({
        banner: 'request seat from admin',
        action: 'clicked request seat button',
        source: sources.USAGE_LIMIT
      }, upgradeData));
    }
  };

  useEffect(function () {
    var apiName = UpgradeProductToApiNameMap[upgradeProduct];
    isMounted.current = true;

    if (SEATED_API_NAMES.includes(apiName)) {
      getParsedProductPurchaseMotions({
        location: USAGE_LIMIT_BANNER,
        apiName: apiName
      }).then(function (purchaseMotions) {
        if (isMounted.current) {
          setSeatedPurchaseMotion(getSeatedPurchaseMotion(purchaseMotions));
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return function () {
      isMounted.current = false;
    };
  }, [upgradeProduct]);
  useEffect(function () {
    if (!seatedPurchaseMotion) return;

    if (isAssignSeatBanner) {
      tracker.track('requestSeatBannerInteraction', Object.assign({
        banner: 'assign yourself a seat',
        action: 'viewed',
        source: sources.USAGE_LIMIT
      }, upgradeData));
    } else {
      tracker.track('requestSeatBannerInteraction', Object.assign({
        banner: 'request seat from admin',
        action: 'viewed',
        source: sources.USAGE_LIMIT
      }, upgradeData));
    }
  }, [isAssignSeatBanner, seatedPurchaseMotion, upgradeData]);

  if (loading) {
    return /*#__PURE__*/_jsx(DefaultBanner, {
      style: props.style
    });
  }

  if (!seatedPurchaseMotion) {
    return children;
  }

  var hubName = getProductNameText(upgradeProduct).split(' ').slice(0, -1).join(' ');
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(DefaultBanner, Object.assign({}, propsToPass, {
      subtext: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.requestSeatBanner." + langKey + ".text",
        options: {
          hubName: hubName
        }
      }),
      button: /*#__PURE__*/_jsx(UIButton, {
        className: "private-upgrades-message-button",
        size: "small",
        use: "primary-white",
        external: isAssignSeatBanner,
        href: isAssignSeatBanner && getPaidUserManagementUrl(),
        onClick: onClick,
        responsive: responsive,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "upgrades.requestSeatBanner." + langKey + ".button"
        })
      })
    })), isModalOpen && /*#__PURE__*/_jsx(AdminModal, {
      apiName: UpgradeProductToApiNameMap[upgradeProduct],
      modalType: AdminModalTypes.REQUEST_SEAT_UPGRADE_BANNER,
      onClose: function onClose() {
        return setIsModalOpen(false);
      },
      upgradeData: upgradeData
    }), /*#__PURE__*/_jsx(UIFloatingAlertList, {})]
  });
};
RequestSeatBannerWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  closeable: PropTypes.bool,
  condensed: PropTypes.bool,
  dataTestId: PropTypes.string,
  onClose: PropTypes.func,
  responsive: PropTypes.bool,
  style: PropTypes.object,
  titleText: PropTypes.node.isRequired,
  upgradeData: PropTypes.object.isRequired
};
export default RequestSeatBannerWrapper;