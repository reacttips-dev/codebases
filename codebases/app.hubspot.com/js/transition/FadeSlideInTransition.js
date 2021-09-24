'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
var duration = 500;

var FadeSlideInTransition = function FadeSlideInTransition(_ref) {
  var inProp = _ref.in,
      children = _ref.children,
      direction = _ref.direction,
      rest = _objectWithoutProperties(_ref, ["in", "children", "direction"]);

  return /*#__PURE__*/_jsx(CSSTransition, Object.assign({
    in: inProp,
    timeout: duration,
    classNames: "fade-slide-transition-" + direction,
    mountOnEnter: true,
    unmountOnExit: true,
    appear: true
  }, rest, {
    children: children
  }));
};

FadeSlideInTransition.displayName = 'FadeSlideInTransition';
FadeSlideInTransition.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['bottom', 'top']),
  in: PropTypes.bool.isRequired
};
FadeSlideInTransition.defaultProps = {
  direction: 'bottom'
};
export default FadeSlideInTransition;