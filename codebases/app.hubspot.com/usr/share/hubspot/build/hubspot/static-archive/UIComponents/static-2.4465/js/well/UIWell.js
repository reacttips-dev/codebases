'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import memoize from 'react-utils/memoize';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { WellContextProvider } from '../context/WellContext';
var getContextValue = memoize(function (orientation) {
  return {
    WellItemComponent: 'li',
    orientation: orientation
  };
});
var wrapItemsMixin = css(["flex-wrap:wrap;@supports (display:grid){display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));}"]);
var verticalMixin = css(["@supports (display:grid){display:flex;}flex-direction:column;"]);
var List = styled.ul.withConfig({
  displayName: "UIWell__List",
  componentId: "czhrb-0"
})(["display:flex;justify-content:space-around;list-style-type:none;margin:0;padding:32px 0 0 12px;", ";", ";a,button{&:hover{text-decoration:none;}}"], function (_ref) {
  var $wrapItems = _ref.$wrapItems;
  return $wrapItems && wrapItemsMixin;
}, function (_ref2) {
  var $orientation = _ref2.$orientation;
  return $orientation === 'vertical' && verticalMixin;
});
export default function UIWell(_ref3) {
  var className = _ref3.className,
      orientation = _ref3.orientation,
      wrapItems = _ref3.wrapItems,
      rest = _objectWithoutProperties(_ref3, ["className", "orientation", "wrapItems"]);

  return /*#__PURE__*/_jsx(WellContextProvider, {
    value: getContextValue(orientation),
    children: /*#__PURE__*/_jsx(List, Object.assign({}, rest, {
      className: classNames('private-well', className),
      $wrapItems: wrapItems,
      $orientation: orientation
    }))
  });
}
UIWell.propTypes = {
  children: PropTypes.node,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  wrapItems: PropTypes.bool
};
UIWell.defaultProps = {
  orientation: 'horizontal',
  wrapItems: true
};
UIWell.displayName = 'UIWell';