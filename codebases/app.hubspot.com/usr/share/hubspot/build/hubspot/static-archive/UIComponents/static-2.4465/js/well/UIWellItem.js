'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import memoize from 'react-utils/memoize';
import styled, { css } from 'styled-components';
import { WellContextConsumer } from '../context/WellContext';
var Inner = styled.div.withConfig({
  displayName: "UIWellItem__Inner",
  componentId: "sc-18k9qzu-0"
})(["max-width:180px;text-align:center;@supports (display:grid){max-width:none;}"]);
var verticalMixin = css(["display:flex;flex-basis:auto;justify-content:center;"]);
var getStyledWellItem = memoize(function (WellItemComponent) {
  return styled(WellItemComponent).withConfig({
    displayName: "UIWellItem",
    componentId: "sc-18k9qzu-1"
  })(["position:relative;flex:1 1 180px;padding:0 12px 0 0;margin-top:18px;margin-bottom:32px;", ""], function (_ref) {
    var $orientation = _ref.$orientation;
    return $orientation === 'vertical' && verticalMixin;
  });
});
export default function UIWellItem(_ref2) {
  var _children = _ref2.children,
      className = _ref2.className,
      rest = _objectWithoutProperties(_ref2, ["children", "className"]);

  return /*#__PURE__*/_jsx(WellContextConsumer, {
    children: function children(_ref3) {
      var WellItemComponent = _ref3.WellItemComponent,
          orientation = _ref3.orientation;
      var StyledWellItem = getStyledWellItem(WellItemComponent);
      return /*#__PURE__*/_jsx(StyledWellItem, Object.assign({}, rest, {
        className: classNames('private-well__item', className),
        $orientation: orientation,
        children: /*#__PURE__*/_jsx(Inner, {
          children: _children
        })
      }));
    }
  });
}
UIWellItem.propTypes = {
  children: PropTypes.node
};
UIWellItem.displayName = 'UIWellItem';