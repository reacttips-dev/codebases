'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SVGWrapper from './SVGWrapper';

var SVGImage = function SVGImage(props) {
  return /*#__PURE__*/_jsx(SVGWrapper, Object.assign({}, props));
};

SVGImage.propTypes = {
  image: PropTypes.string
};
export default SVGImage;