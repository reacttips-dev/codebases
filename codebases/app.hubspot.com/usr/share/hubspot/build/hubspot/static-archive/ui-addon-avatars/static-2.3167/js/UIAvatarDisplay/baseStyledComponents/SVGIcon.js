'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SVGTextIconStyle from './SVGTextIconStyle';
import SVGWrapper from './SVGWrapper';

var SVGIcon = function SVGIcon(props) {
  var wrapperProps = props.wrapperProps,
      icon = props.icon,
      innerProps = _objectWithoutProperties(props, ["wrapperProps", "icon"]);

  return /*#__PURE__*/_jsx(SVGWrapper, Object.assign({}, wrapperProps, {
    children: /*#__PURE__*/_jsx(SVGTextIconStyle, Object.assign({}, innerProps, {
      children: icon
    }))
  }));
};

SVGIcon.propTyes = {
  wrapperProps: PropTypes.node,
  icon: PropTypes.string
};
export default SVGIcon;