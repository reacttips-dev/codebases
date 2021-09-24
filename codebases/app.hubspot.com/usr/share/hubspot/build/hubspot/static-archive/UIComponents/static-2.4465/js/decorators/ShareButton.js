'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from 'react';
import getComponentName from 'react-utils/getComponentName';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import refObject from '../utils/propTypes/refObject';
import { attachWrappedComponent } from './utils';
export default function (Component) {
  var ShareButtonComponent = memoWithDisplayName("ShareButton(" + getComponentName(Component) + ")", function (props) {
    var buttonRef = props.buttonRef,
        rest = _objectWithoutProperties(props, ["buttonRef"]);

    var defaultRef = useRef(null);
    return /*#__PURE__*/_jsx(Component, Object.assign({}, rest, {
      buttonRef: buttonRef || defaultRef
    }));
  });
  ShareButtonComponent.propTypes = Object.assign({}, Component.propTypes, {
    buttonRef: refObject
  });
  ShareButtonComponent.defaultProps = Component.defaultProps;
  attachWrappedComponent(ShareButtonComponent, Component);
  return ShareButtonComponent;
}