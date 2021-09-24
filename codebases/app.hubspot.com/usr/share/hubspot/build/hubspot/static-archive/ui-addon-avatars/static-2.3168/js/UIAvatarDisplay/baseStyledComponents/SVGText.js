'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SVGTextStyle from './SVGTextStyle';
import SVGWrapper from './SVGWrapper';

var SVGText = function SVGText(props) {
  var wrapperProps = props.wrapperProps,
      innerProps = _objectWithoutProperties(props, ["wrapperProps"]);

  return /*#__PURE__*/_jsx(SVGWrapper, Object.assign({}, wrapperProps, {
    children: /*#__PURE__*/_jsx(SVGTextStyle, Object.assign({}, innerProps))
  }));
};

SVGText.propTypes = {
  wrapperProps: PropTypes.any
};
export default SVGText;