'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import getComponentName from 'react-utils/getComponentName';
import { useChecked, checkedPropTypes } from '../hooks/useChecked';
import { attachWrappedComponent } from './utils';
/**
 * Similar to `Controllable`, but specifically for controlling a `checked` property using the same
 * API as native checkbox inputs: `checked`, `defaultChecked`, and `onChange`. Additionally,
 * the events passed to `onChange` use `evt.target.checked` instead of `evt.target.value`.
 *
 * This should not be used with radio inputs, as their `checked` state is dependant on the
 * others inputs in the group (see UIComponents#9441).
 *
 * @param {JSX.Component} Component
 * @returns {JSX.Component} A component with defaultable `checked` prop
 */

export default function Checkable(Component) {
  var CheckableComponent = /*#__PURE__*/forwardRef(function (props, ref) {
    var __checked = props.checked,
        __defaultChecked = props.defaultChecked,
        __onChange = props.onChange,
        rest = _objectWithoutProperties(props, ["checked", "defaultChecked", "onChange"]); // eslint-disable-next-line react-hooks/rules-of-hooks


    var _useChecked = useChecked(props),
        checked = _useChecked.checked,
        onChange = _useChecked.onChange;

    return /*#__PURE__*/_jsx(Component, Object.assign({}, rest, {
      checked: checked,
      onChange: onChange,
      ref: ref
    }));
  });
  CheckableComponent.propTypes = Object.assign({}, Component.propTypes, {}, checkedPropTypes);
  CheckableComponent.defaultProps = Object.assign({}, Component.defaultProps, {
    defaultChecked: Component.defaultProps && Component.defaultProps.checked != null ? Component.defaultProps.checked : false
  });
  delete CheckableComponent.defaultProps.checked;
  CheckableComponent.displayName = "Checkable(" + getComponentName(Component) + ")";
  attachWrappedComponent(CheckableComponent, Component);
  return CheckableComponent;
}