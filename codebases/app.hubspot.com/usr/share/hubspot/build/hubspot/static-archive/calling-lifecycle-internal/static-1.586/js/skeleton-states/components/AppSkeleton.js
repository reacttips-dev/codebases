'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { PropTypes } from 'prop-types';
import CalleeDropdownSkeleton from './CalleeDropdownSkeleton';
import CalleeSkeleton from './CalleeSkeleton';
import PreCallFooterSkeleton from './PreCallFooterSkeleton';
import SkeletonRTE from './SkeletonRTE';
import WidgetSettingsWrapper from './WidgetSettingsWrapper';
import styled from 'styled-components';
import CalleeAvatarSkeleton from './CalleeAvatarSkeleton';
var Wrapper = styled.div.withConfig({
  displayName: "AppSkeleton__Wrapper",
  componentId: "yh5qig-0"
})(["position:relative;height:100%;width:100%;"]);
var Body = styled.div.withConfig({
  displayName: "AppSkeleton__Body",
  componentId: "yh5qig-1"
})(["flex:1;"]);
var Footer = styled.div.withConfig({
  displayName: "AppSkeleton__Footer",
  componentId: "yh5qig-2"
})(["position:sticky;bottom:0;"]);

function AppSkeleton(_ref) {
  var isThirdPartyProvider = _ref.isThirdPartyProvider;
  return /*#__PURE__*/_jsxs(Wrapper, {
    className: "flex-column",
    children: [/*#__PURE__*/_jsxs(Body, {
      className: "p-x-3 p-top-4 flex-column",
      children: [isThirdPartyProvider && /*#__PURE__*/_jsx(CalleeAvatarSkeleton, {}), /*#__PURE__*/_jsx(CalleeSkeleton, {}), /*#__PURE__*/_jsx(CalleeDropdownSkeleton, {}), !isThirdPartyProvider && /*#__PURE__*/_jsx(SkeletonRTE, {})]
    }), /*#__PURE__*/_jsxs(Footer, {
      children: [/*#__PURE__*/_jsx("div", {
        className: "p-bottom-3 p-x-3",
        children: /*#__PURE__*/_jsx(PreCallFooterSkeleton, {})
      }), /*#__PURE__*/_jsx(WidgetSettingsWrapper, {})]
    })]
  });
}

AppSkeleton.propTypes = {
  isThirdPartyProvider: PropTypes.bool
};
AppSkeleton.defaultProps = {
  isThirdPartyProvider: false
};
export default /*#__PURE__*/memo(AppSkeleton);