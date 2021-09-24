'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
var FeaturesButton = styled(UIButton).withConfig({
  displayName: "ShowFeaturesButton__FeaturesButton",
  componentId: "sc-1hqvw7a-0"
})(["&&&{color:white;font-weight:600;}"]);
var FeaturesButtonIcon = styled(UIIcon).withConfig({
  displayName: "ShowFeaturesButton__FeaturesButtonIcon",
  componentId: "sc-1hqvw7a-1"
})(["&&&{color:white !important;size:14px !important;}"]);

function ShowFeaturesButton(_ref) {
  var showFlydown = _ref.showFlydown,
      onClick = _ref.onClick;
  return /*#__PURE__*/_jsxs(FeaturesButton, {
    use: "link",
    onClick: onClick,
    "data-test-id": "show-features-button",
    children: [/*#__PURE__*/_jsx("span", {
      className: "m-right-1",
      children: showFlydown ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.hideFeatures"
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.showFeatures"
      })
    }), /*#__PURE__*/_jsx(FeaturesButtonIcon, {
      name: showFlydown ? 'up' : 'down',
      size: "xxs"
    })]
  });
}

export default ShowFeaturesButton;