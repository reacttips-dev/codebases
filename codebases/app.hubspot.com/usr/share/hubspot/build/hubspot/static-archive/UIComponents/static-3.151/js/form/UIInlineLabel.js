'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import useUniqueId from 'react-utils/hooks/useUniqueId';
import styled from 'styled-components';
import { warnIfFragment } from '../utils/devWarnings';
var InlineLabel = styled.label.withConfig({
  displayName: "UIInlineLabel__InlineLabel",
  componentId: "sc-6urmnn-0"
})(["display:inline-flex;align-items:center;margin-right:12px;"]);
var LabelText = styled.div.withConfig({
  displayName: "UIInlineLabel__LabelText",
  componentId: "sc-6urmnn-1"
})(["flex-shrink:0;margin-right:8px;user-select:none;"]);

var UIInlineLabel = function UIInlineLabel(props) {
  var children = props.children,
      id = props.id,
      label = props.label,
      rest = _objectWithoutProperties(props, ["children", "id", "label"]);

  var defaultId = useUniqueId("uiinlinelabel-");
  var computedId = id || defaultId;
  warnIfFragment(children, UIInlineLabel.displayName);
  return /*#__PURE__*/_jsxs(InlineLabel, Object.assign({}, rest, {
    id: computedId,
    children: [/*#__PURE__*/_jsx(LabelText, {
      children: label
    }), /*#__PURE__*/cloneElement(children, {
      'aria-labelledby': computedId
    })]
  }));
};

UIInlineLabel.propTypes = {
  children: PropTypes.element.isRequired,
  label: PropTypes.node.isRequired
};
UIInlineLabel.displayName = 'UIInlineLabel';
export default UIInlineLabel;