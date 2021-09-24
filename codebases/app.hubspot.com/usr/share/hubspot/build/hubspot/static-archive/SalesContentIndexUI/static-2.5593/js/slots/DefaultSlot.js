'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Children } from 'react';
import cloneElement from 'SalesContentIndexUI/utils/cloneElement';

var DefaultSlot = function DefaultSlot(props) {
  var children = props.children,
      passProps = props.passProps,
      otherProps = _objectWithoutProperties(props, ["children", "passProps"]);

  if (children) {
    var childrenWithProps = Children.map(children, function (child) {
      return passProps ? cloneElement(child, otherProps) : child;
    });
    return /*#__PURE__*/_jsx("div", {
      children: childrenWithProps
    });
  }

  return /*#__PURE__*/_jsx("div", {});
};

DefaultSlot.propTypes = {
  children: PropTypes.any,
  passProps: PropTypes.bool.isRequired
};
DefaultSlot.defaultProps = {
  passProps: true
};
export default DefaultSlot;