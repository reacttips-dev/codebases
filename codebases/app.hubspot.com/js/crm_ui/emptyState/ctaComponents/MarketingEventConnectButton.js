'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PortalIdParser from 'PortalIdParser';
import { useState } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedHTMLMessage';
import UIIntegrationsDirectoryPanel from 'ui-addon-integrations-directory-panel/UIIntegrationsDirectoryPanel';

var MarketingEventConnectButton = function MarketingEventConnectButton() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isDirectoryPanelOpen = _useState2[0],
      setIsDirectoryPanelOpen = _useState2[1];

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      onClick: function onClick() {
        return setIsDirectoryPanelOpen(true);
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "zeroStates.marketingEvents.ctaText"
      })
    }), /*#__PURE__*/_jsx(UIIntegrationsDirectoryPanel, {
      isOpen: isDirectoryPanelOpen,
      onPanelClose: function onPanelClose() {
        return setIsDirectoryPanelOpen(false);
      },
      portalId: PortalIdParser.get(),
      sourceAppId: "crm-marketing-events",
      onConnectionComplete: function onConnectionComplete() {
        return window.location.href = "/integrations-settings/" + PortalIdParser.get() + "/installed";
      }
    })]
  });
};

export default MarketingEventConnectButton;