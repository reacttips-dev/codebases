'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIIconButton from 'UIComponents/button/UIIconButton';
import { FLINT, CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import { MEDIUM_CLOSE_BUTTON_SIZE } from 'HubStyleTokens/sizes';
import UIIcon from 'UIComponents/icon/UIIcon';
var RemoveFilterButton = styled(UIIconButton).attrs({
  size: 'extra-small',
  use: 'transparent',
  color: FLINT
}).withConfig({
  displayName: "FilterWithClearButton__RemoveFilterButton",
  componentId: "r9mocw-0"
})(["&&{font-size:", ";}"], MEDIUM_CLOSE_BUTTON_SIZE);
var FilterWrapper = styled.div.withConfig({
  displayName: "FilterWithClearButton__FilterWrapper",
  componentId: "r9mocw-1"
})(["padding:0 4px 0 8px;margin:0 12px 0 0;display:inline;", ";"], function (props) {
  return props.isActive && "background-color: " + CALYPSO_LIGHT + ";border-radius: 3px;";
});
var FilterButtonWrapper = styled.div.withConfig({
  displayName: "FilterWithClearButton__FilterButtonWrapper",
  componentId: "r9mocw-2"
})(["display:inline-block;"]);

var FilterWithClearButton = function FilterWithClearButton(_ref) {
  var isActive = _ref.isActive,
      children = _ref.children,
      onRemoveClick = _ref.onRemoveClick;
  return /*#__PURE__*/_jsxs(FilterWrapper, {
    isActive: isActive,
    children: [/*#__PURE__*/_jsx("label", {
      children: children
    }), isActive && /*#__PURE__*/_jsx(FilterButtonWrapper, {
      children: /*#__PURE__*/_jsx(RemoveFilterButton, {
        onClick: onRemoveClick,
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "remove",
          color: FLINT
        })
      })
    })]
  });
};

FilterWithClearButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onRemoveClick: PropTypes.func.isRequired
};
export default FilterWithClearButton;