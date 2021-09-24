'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useMemo } from 'react';
import styled from 'styled-components';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import { tracker } from './tracker';
import PropTypes from 'prop-types';
var FeaturesButton = styled(UIButton).withConfig({
  displayName: "ShowContextFeaturesButton__FeaturesButton",
  componentId: "sc-19nmd1s-0"
})(["&&&{color:white;font-weight:600;}"]);
var FeaturesButtonIcon = styled(UIIcon).withConfig({
  displayName: "ShowContextFeaturesButton__FeaturesButtonIcon",
  componentId: "sc-19nmd1s-1"
})(["&&&{color:white !important;size:14px !important;}"]);

function ShowContextFeaturesButton(_ref) {
  var appContext = _ref.appContext,
      _onClick = _ref.onClick,
      showFlydown = _ref.showFlydown;
  var renderedButtonText = useMemo(function () {
    switch (appContext) {
      case 'CAMPAIGNS':
        return showFlydown ? /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.hideCampaignsFeatures"
        }) : /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.showCampaignsFeatures"
        });

      case 'WORKFLOWS':
        return showFlydown ? /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.hideWorkflowsFeatures"
        }) : /*#__PURE__*/_jsx(FormattedMessage, {
          message: "trial-banner-ui.contextualFlydown.showWorkflowsFeatures"
        });

      default:
        return null;
    }
  }, [appContext, showFlydown]);
  return /*#__PURE__*/_jsxs(FeaturesButton, {
    "data-test-id": "show-features-button",
    use: "link",
    onClick: function onClick() {
      if (!showFlydown) {
        tracker.track('interaction', {
          action: 'showContextualFlydown',
          context: appContext
        });
      }

      _onClick();
    },
    children: [/*#__PURE__*/_jsx("span", {
      className: "m-right-1",
      children: renderedButtonText
    }), /*#__PURE__*/_jsx(FeaturesButtonIcon, {
      name: showFlydown ? 'up' : 'down',
      size: "xxs"
    })]
  });
}

ShowContextFeaturesButton.propTypes = {
  appContext: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  showFlydown: PropTypes.bool.isRequired
};
export default ShowContextFeaturesButton;