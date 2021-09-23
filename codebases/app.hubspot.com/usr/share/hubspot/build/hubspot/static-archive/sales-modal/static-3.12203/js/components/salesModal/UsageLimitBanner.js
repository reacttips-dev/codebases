'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _USAGE_LIMITS;

import PropTypes from 'prop-types';
import * as SalesModalTabs from 'sales-modal/constants/SalesModalTabs';
import UIUsageLimitBanner from 'ui-addon-upgrades/alert/UIUsageLimitBanner';
var DOCUMENTS_LIMIT = 5;
var TEMPLATES_LIMIT = 5;
var USAGE_LIMITS = (_USAGE_LIMITS = {}, _defineProperty(_USAGE_LIMITS, SalesModalTabs.DOCUMENTS, DOCUMENTS_LIMIT), _defineProperty(_USAGE_LIMITS, SalesModalTabs.TEMPLATES, TEMPLATES_LIMIT), _USAGE_LIMITS);

var UsageLimitBanner = function UsageLimitBanner(props) {
  var currentTab = props.currentTab,
      sizeOfContent = props.sizeOfContent;
  var tab = currentTab.toLowerCase();
  var upgradeData = {
    app: 'client',
    screen: 'modal',
    uniqueId: tab,
    upgradeProduct: 'sales-starter'
  };
  return /*#__PURE__*/_jsx(UIUsageLimitBanner, {
    feature: tab,
    upgradeData: upgradeData,
    value: sizeOfContent,
    limit: USAGE_LIMITS[currentTab]
  });
};

UsageLimitBanner.propTypes = {
  currentTab: PropTypes.oneOf(Object.values(SalesModalTabs || {})).isRequired,
  sizeOfContent: PropTypes.number.isRequired
};
export default UsageLimitBanner;