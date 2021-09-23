'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import classNames from 'classnames';
import { RegistersPanelBody } from '../context/PanelComponentRegistrationContext';
var UIPanelBody = /*#__PURE__*/forwardRef(function (props, ref) {
  var children = props.children,
      className = props.className,
      rest = _objectWithoutProperties(props, ["children", "className"]);

  return /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
    className: classNames(className, 'private-panel__body'),
    ref: ref,
    children: [/*#__PURE__*/_jsx(RegistersPanelBody, {}), children]
  }));
});
UIPanelBody.propTypes = {
  children: PropTypes.node
};
UIPanelBody.displayName = 'UIPanelBody';
export default UIPanelBody;