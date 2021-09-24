'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import UISelect from 'UIComponents/input/UISelect';
import CustomObjectAdminCelebrationModal from '../../../modals/customObjectAdminCelebration/CustomObjectAdminCelebrationModal';
import CustomObjectAdminCelebrationShepherd from '../../../shepherding/customObjectAdmin/CustomObjectAdminCelebrationShepherd';
import { MARKETING_EVENT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useObjectSwitcherOptions } from '../hooks/useObjectSwitcherOptions';
import { MarketingEventModal } from '../../../modals/marketingEventModal';
import { useIsRewriteEnabled } from '../../../rewrite/init/context/IsRewriteEnabledContext';
import { useGates } from '../../../rewrite/auth/hooks/useGates';
import { isRewriteSupported } from '../../../rewrite/init/utils/isRewriteSupportedForURL';
import PortalIdParser from 'PortalIdParser';
import { navigateToPath } from '../../../rewrite/navigation/utils/navigateToPath';
import quickFetch from 'quick-fetch';
var portalId = PortalIdParser.get();
export var ObjectSwitcher = function ObjectSwitcher() {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      marketingEventOption = _useState2[0],
      setMarketingEventOption = _useState2[1];

  var _useObjectSwitcherOpt = useObjectSwitcherOptions(),
      currentOption = _useObjectSwitcherOpt.currentOption,
      options = _useObjectSwitcherOpt.options,
      selectOption = _useObjectSwitcherOpt.selectOption;

  var gates = useGates();
  var isRewriteEnabled = useIsRewriteEnabled();

  var handleNavigate = function handleNavigate(option) {
    var selectedTypeId = option.objectTypeDef.objectTypeId;
    var doesSelectionSupportRewrite = isRewriteSupported({
      objectTypeId: selectedTypeId,
      gates: gates
    });
    var shouldDoFullPageRedirect = isRewriteEnabled !== doesSelectionSupportRewrite;

    if (shouldDoFullPageRedirect) {
      // If we are selecting an object on the rewrite from one not on the rewrite (or vice versa),
      // the app must be fully reloaded in order to activate the correct state system.
      navigateToPath("/contacts/" + portalId + option.value);
    } else {
      selectOption(option);
    }
  };

  var handleChange = function handleChange(evt) {
    quickFetch.clearAllRequests();
    var option = evt.target.value;

    if (option.objectTypeDef.objectTypeId === MARKETING_EVENT_TYPE_ID) {
      setMarketingEventOption(option);
    } else {
      handleNavigate(option);
    }
  };

  var onMEModalConfirm = function onMEModalConfirm() {
    handleNavigate(marketingEventOption);
    setMarketingEventOption(null);
  };

  var onMEModalDeny = function onMEModalDeny() {
    setMarketingEventOption(null);
  };

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [marketingEventOption && /*#__PURE__*/_jsx(MarketingEventModal, {
      onConfirm: onMEModalConfirm,
      onDeny: onMEModalDeny
    }), /*#__PURE__*/_jsx(CustomObjectAdminCelebrationModal, {}), /*#__PURE__*/_jsx(CustomObjectAdminCelebrationShepherd, {
      children: /*#__PURE__*/_jsx(UISelect, {
        buttonUse: "link",
        placement: "bottom right",
        menuWidth: 350,
        options: options,
        value: currentOption.value,
        onSelectedOptionChange: handleChange
      })
    })]
  });
};