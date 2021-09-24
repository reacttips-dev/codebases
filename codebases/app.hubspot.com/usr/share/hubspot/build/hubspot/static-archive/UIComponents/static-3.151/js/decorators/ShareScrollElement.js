'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useRef } from 'react';
import getComponentName from 'react-utils/getComponentName';
import { attachWrappedComponent } from './utils';
import refObject from '../utils/propTypes/refObject';
export default function (Component) {
  var ShareScrollElementComponent = /*#__PURE__*/forwardRef(function (props, ref) {
    var scrollElementRef = props.scrollElementRef,
        rest = _objectWithoutProperties(props, ["scrollElementRef"]);

    var defaultRef = useRef(null);
    return /*#__PURE__*/_jsx(Component, Object.assign({}, rest, {
      scrollElementRef: scrollElementRef || defaultRef,
      ref: ref
    }));
  });
  var componentName = getComponentName(Component);
  ShareScrollElementComponent.displayName = "ShareScrollElement(" + componentName + ")";
  ShareScrollElementComponent.propTypes = Object.assign({}, Component.propTypes, {
    scrollElementRef: refObject
  });
  ShareScrollElementComponent.defaultProps = Component.defaultProps;
  attachWrappedComponent(ShareScrollElementComponent, Component);
  return ShareScrollElementComponent;
}