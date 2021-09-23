'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import styled from 'styled-components';
import { ModalTransitionContextProvider } from '../../context/ModalTransitionContext';
var InnerMeasure = styled.span.attrs({
  'aria-hidden': true
}).withConfig({
  displayName: "HiddenMeasure__InnerMeasure",
  componentId: "cvwa7p-0"
})(["overflow:hidden;position:absolute;left:0;max-width:100%;visibility:hidden;pointer-events:none;"]); // We want to force popovers to stay closed, so we use ModalTransitionContext to tell popovers that
// they're in a transitioning modal. Weird but effective!

var hidePopoversContextValue = {
  transitioning: true
};
var HiddenMeasure = /*#__PURE__*/forwardRef(function (props, ref) {
  return /*#__PURE__*/_jsx(ModalTransitionContextProvider, {
    value: hidePopoversContextValue,
    children: /*#__PURE__*/_jsx(InnerMeasure, Object.assign({}, props, {
      ref: ref
    }))
  });
});
export default HiddenMeasure;