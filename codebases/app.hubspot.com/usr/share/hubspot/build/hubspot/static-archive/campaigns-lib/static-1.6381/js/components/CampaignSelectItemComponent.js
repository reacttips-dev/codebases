'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITruncateString from 'UIComponents/text/UITruncateString';
import styled from 'styled-components';
var PointerTruncateString = styled(UITruncateString).withConfig({
  displayName: "CampaignSelectItemComponent__PointerTruncateString",
  componentId: "sc-1d6wow3-0"
})(["&:hover{cursor:pointer !important;}"]);
import CampaignColorDot from './CampaignColorDot';

function CampaignSelectItemComponent(_ref) {
  var children = _ref.children,
      option = _ref.option,
      multi = _ref.multi,
      buttonUse = _ref.buttonUse,
      rest = _objectWithoutProperties(_ref, ["children", "option", "multi", "buttonUse"]);

  if (option.buttonText && option.dropdownText || option.options || // isSpecial cases are for built in functionality like the load more / loading rows.
  option.isSpecial) {
    // If the option is a built in one, we simply return the children wrapped in a span
    return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
      children: children
    }));
  }

  var isTransparentButton = buttonUse === 'transparent';
  var truncateOptionValue = !option.isInTree && isTransparentButton ? {
    maxWidth: 200
  } : {};
  var shouldTruncate = option.isInTree || !multi;

  var optionContent = /*#__PURE__*/_jsxs(UIFlex, {
    align: "center",
    children: [(option.isInTree || option.colorHex) && /*#__PURE__*/_jsx(CampaignColorDot, {
      className: "m-right-2 flex-grow-1",
      "data-test-id": "campaign-color-dot-" + option.value,
      style: {
        backgroundColor: option.colorHex
      }
    }), shouldTruncate ? /*#__PURE__*/_jsx(PointerTruncateString, Object.assign({}, truncateOptionValue, {
      children: option.text || option.value
    })) : option.text || option.value]
  });

  if (!option.isInTree) {
    return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
      children: optionContent
    }));
  }

  return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(UIButton, {
      className: "p-left-1",
      title: option.text,
      use: "unstyled",
      children: optionContent
    })
  }));
}

export default CampaignSelectItemComponent;