'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BASE_SPACING_X } from 'HubStyleTokens/sizes';
import { isIE11 } from '../utils/BrowserTest';
var Toolbar = styled.div.withConfig({
  displayName: "AbstractToolbar__Toolbar",
  componentId: "ect5fr-0"
})(["padding:", " 0 0 ", ";"], BASE_SPACING_X, BASE_SPACING_X);
var ToolbarInner = styled.div.withConfig({
  displayName: "AbstractToolbar__ToolbarInner",
  componentId: "ect5fr-1"
})(["align-items:center;display:flex;flex-wrap:", ";justify-content:space-between;margin:-", " 0 0 -", ";> * + *{margin-left:", ";}"], function (props) {
  return props.responsive && 'wrap';
}, BASE_SPACING_X, BASE_SPACING_X, BASE_SPACING_X);
var SlotFlexContainer = styled.div.withConfig({
  displayName: "AbstractToolbar__SlotFlexContainer",
  componentId: "ect5fr-2"
})(["align-items:center;display:flex;flex-shrink:0;flex:", ";> * + *{margin-left:", ";}> .private-button.private-button{flex-shrink:0;margin-top:0;width:auto;}"], function (props) {
  return props.__distributeEvenly && !isIE11() && '1 1 0%';
}, BASE_SPACING_X);
var StartSlot = styled(SlotFlexContainer).withConfig({
  displayName: "AbstractToolbar__StartSlot",
  componentId: "ect5fr-3"
})(["justify-content:flex-start;"]);
var MiddleSlot = styled(SlotFlexContainer).withConfig({
  displayName: "AbstractToolbar__MiddleSlot",
  componentId: "ect5fr-4"
})(["flex-grow:0;flex-shrink:1;justify-content:center;white-space:", ";"], function (props) {
  return props.__distributeEvenly && 'nowrap';
});
var EndSlot = styled(SlotFlexContainer).withConfig({
  displayName: "AbstractToolbar__EndSlot",
  componentId: "ect5fr-5"
})(["justify-content:flex-end;"]);

var AbstractToolbar = function AbstractToolbar(props) {
  var __distributeEvenly = props.__distributeEvenly,
      Inner = props.Inner,
      End = props.End,
      endSlot = props.endSlot,
      Middle = props.Middle,
      middleSlot = props.middleSlot,
      responsive = props.responsive,
      role = props.role,
      Start = props.Start,
      startSlot = props.startSlot,
      rest = _objectWithoutProperties(props, ["__distributeEvenly", "Inner", "End", "endSlot", "Middle", "middleSlot", "responsive", "role", "Start", "startSlot"]);

  return /*#__PURE__*/_jsx(Toolbar, Object.assign({}, rest, {
    role: role,
    children: /*#__PURE__*/_jsxs(Inner, {
      responsive: responsive,
      children: [startSlot ? /*#__PURE__*/_jsx(Start, {
        __distributeEvenly: __distributeEvenly,
        children: startSlot
      }) : null, middleSlot ? /*#__PURE__*/_jsx(Middle, {
        __distributeEvenly: __distributeEvenly,
        children: middleSlot
      }) : null, endSlot ? /*#__PURE__*/_jsx(End, {
        __distributeEvenly: __distributeEvenly,
        children: endSlot
      }) : null]
    })
  }));
};

AbstractToolbar.propTypes = {
  __distributeEvenly: PropTypes.bool,
  End: PropTypes.elementType,
  endSlot: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  Inner: PropTypes.elementType,
  Middle: PropTypes.elementType,
  middleSlot: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  responsive: PropTypes.bool.isRequired,
  role: PropTypes.string,
  Start: PropTypes.elementType,
  startSlot: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
};
AbstractToolbar.defaultProps = {
  End: EndSlot,
  Inner: ToolbarInner,
  Middle: MiddleSlot,
  responsive: true,
  role: 'group',
  Start: StartSlot
};
AbstractToolbar.displayName = 'AbstractToolbar';
export default AbstractToolbar;