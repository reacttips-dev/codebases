'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UISelectableBox from 'UIComponents/button/UISelectableBox';
import UpgradeProductProperties from 'self-service-api/constants/UpgradeProductProperties';
import { getUpgradeButtonText } from 'ui-addon-upgrades/_core/common/adapters/getUpgradeButtonText';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { sources } from 'ui-addon-upgrades/_core/common/data/upgradeData/properties/sources';
import { sourceKeys } from 'ui-addon-upgrades/_core/common/data/upgradeData/properties/sources';
import { getCorrectedUpgradeData } from '../_core/utils/getCorrectedUpgradeData';
import { PricingPageRedirectButtonPropsInterface } from './interfaces/pricingPageRedirectButtonInterface';
import { omit } from 'ui-addon-upgrades/utils';
import UpgradeProductToApiNameMap from 'self-service-api/constants/UpgradeProductToApiNameMap';
import { getProducts } from 'self-service-api/api/getProducts';
import { getSkuIdFromApiName } from '../_core/utils/productUtils';
import { getProductInfoFromSkuId } from 'self-service-api/core/utilities/productUtils';

var getSource = function getSource(_ref) {
  var app = _ref.app,
      screen = _ref.screen,
      uniqueId = _ref.uniqueId;
  return app + "-" + screen + "-" + sources[sourceKeys.GENERAL] + "-" + uniqueId;
};

var UIPricingPageRedirectButton = function UIPricingPageRedirectButton(props) {
  var _isMounted = useRef(true);

  var upgradeData = props.upgradeData,
      isSelectableBox = props.isSelectableBox,
      subscreen = props.subscreen,
      children = props.children;
  var correctedUpgradeData = getCorrectedUpgradeData(upgradeData);
  var upgradeProduct = correctedUpgradeData.upgradeProduct;
  var propsToPass = omit(props, 'isSelectableBox', 'upgradeData', 'subscreen');
  var source = getSource(correctedUpgradeData);
  var upgradeLink = UpgradeProductProperties[upgradeProduct].upgradeLink;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      products = _useState2[0],
      setProducts = _useState2[1];

  useEffect(function () {
    tracker.track('pricingPageRedirectButtonInteraction', {
      action: 'viewed',
      upgradeProduct: upgradeProduct,
      source: source,
      subscreen: subscreen
    });
  }, [correctedUpgradeData, upgradeProduct, source, subscreen]);
  useEffect(function () {
    if (_isMounted.current) {
      getProducts().then(function (response) {
        if (_isMounted.current) {
          setProducts(response);
        }
      });
    }
  }, [setProducts]);
  useEffect(function () {
    return function cleanup() {
      _isMounted.current = false;
    };
  }, []);
  var apiName = UpgradeProductToApiNameMap[upgradeProduct];

  var getRedirectLink = function getRedirectLink() {
    if (!products || !apiName) {
      return upgradeLink(correctedUpgradeData.uniqueId);
    }

    var _getProductInfoFromSk = getProductInfoFromSkuId(products, getSkuIdFromApiName(products, apiName)),
        productLevel = _getProductInfoFromSk.productLevel;

    return upgradeLink(correctedUpgradeData.uniqueId, productLevel);
  };

  var handleUpgrade = function handleUpgrade() {
    tracker.track('pricingPageRedirectButtonInteraction', {
      action: 'clicked',
      upgradeProduct: upgradeProduct,
      source: source,
      subscreen: subscreen
    });
  };

  if (isSelectableBox) {
    return /*#__PURE__*/_jsx(UISelectableBox, Object.assign({
      onClick: handleUpgrade
    }, propsToPass, {
      children: children
    }));
  }

  return /*#__PURE__*/_jsx(UIButton, Object.assign({
    target: "_blank",
    "data-reagan-primary-cta": true,
    "data-selenium": "pricing-page-redirect-button",
    onClick: handleUpgrade,
    href: getRedirectLink()
  }, propsToPass, {
    children: children || getUpgradeButtonText('upgrade', upgradeProduct)
  }));
};

UIPricingPageRedirectButton.defaultProps = {
  use: 'primary',
  isSelectableBox: false // only use this prop when absolutely needed

};
UIPricingPageRedirectButton.propTypes = PricingPageRedirectButtonPropsInterface;
export default UIPricingPageRedirectButton;