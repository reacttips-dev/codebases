'use es6';

import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIImage from 'UIComponents/image/UIImage';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import styled from 'styled-components';
export var RadioButtonWithNoBorder = styled(UIRadioInput).withConfig({
  displayName: "CozyCardIllustrationOptions__RadioButtonWithNoBorder",
  componentId: "sc-1xte48z-0"
})(["margin-right:0 !important;margin-bottom:0.5rem;"]);
var IllustrationsContainer = styled(UIGrid).withConfig({
  displayName: "CozyCardIllustrationOptions__IllustrationsContainer",
  componentId: "sc-1xte48z-1"
})(["padding-bottom:1rem;"]);
export var CozyCardIllustrationOptions = function CozyCardIllustrationOptions(_ref) {
  var options = _ref.options;
  var illustrations = options.map(function (_ref2) {
    var illustration = _ref2.illustration,
        key = _ref2.key,
        onSelect = _ref2.onSelect;
    return /*#__PURE__*/_jsx(UIGridItem, {
      size: {
        xs: 6
      },
      className: "justify-center",
      children: /*#__PURE__*/_jsx(UIImage, {
        src: illustration,
        onClick: onSelect
      })
    }, key);
  });
  var labelsAndRadioButtons = options.map(function (_ref3) {
    var label = _ref3.label,
        selected = _ref3.selected,
        key = _ref3.key,
        onSelect = _ref3.onSelect,
        testSelector = _ref3.testSelector;
    return /*#__PURE__*/_jsxs(UIGridItem, {
      size: {
        xs: 6
      },
      className: "align-center flex-column",
      children: [/*#__PURE__*/_jsx(RadioButtonWithNoBorder, {
        checked: selected,
        inline: false,
        className: "justify-center",
        onClick: onSelect,
        name: key + "-radio-button",
        "aria-labelledby": key + "-label",
        "data-selenium-test": testSelector
      }), /*#__PURE__*/_jsx("p", {
        id: key + "-label",
        children: label
      })]
    }, key);
  });
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(IllustrationsContainer, {
      children: illustrations
    }), /*#__PURE__*/_jsx(UIGrid, {
      children: labelsAndRadioButtons
    })]
  });
};