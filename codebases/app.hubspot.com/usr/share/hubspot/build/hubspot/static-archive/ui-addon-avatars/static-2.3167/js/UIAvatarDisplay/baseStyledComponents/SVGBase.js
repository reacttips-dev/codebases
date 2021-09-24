'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { AVATAR_SIZES } from '../../Constants';

var SVGBase = function SVGBase(props) {
  var __isHasMore = props._isHasMore,
      __isListReversed = props._isListReversed,
      __src = props.src,
      __styledJunk0 = props['0'],
      __styledJunk1 = props['1'],
      rest = _objectWithoutProperties(props, ["_isHasMore", "_isListReversed", "src", "0", "1"]);

  return /*#__PURE__*/_jsx("svg", Object.assign({
    viewBox: "0 0 100 100",
    xmlns: "http://www.w3.org/2000/svg"
  }, rest));
};

SVGBase.propTypes = {
  size: PropTypes.oneOf(Object.keys(AVATAR_SIZES)),
  _isHasMore: PropTypes.bool,
  _isListReversed: PropTypes.bool,
  '0': PropTypes.any,
  '1': PropTypes.any,
  src: PropTypes.string
};
export default SVGBase;