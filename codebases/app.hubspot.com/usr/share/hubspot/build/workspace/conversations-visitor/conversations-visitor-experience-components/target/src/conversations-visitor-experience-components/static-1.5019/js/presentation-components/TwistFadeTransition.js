'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
var TransitionComponent = styled.div.withConfig({
  displayName: "TwistFadeTransition__TransitionComponent",
  componentId: "sc-1o1gdxj-0"
})(["transition:transform 0.16s linear 0s,opacity 0.06s linear;opacity:0;", " ", ""], function (_ref) {
  var direction = _ref.direction;
  return direction === 'left' ? 'transform: rotate(25deg) scale(0);' : 'transform: rotate(-25deg) scale(0);';
}, function (_ref2) {
  var direction = _ref2.direction,
      transitionState = _ref2.transitionState;

  if (transitionState === 'entering' || transitionState === 'entered') {
    return "opacity: 1; transform: rotate(0deg) scale(1);";
  }

  if (direction === 'left' && (transitionState === 'exiting' || transitionState === 'exiting')) {
    return 'opacity: 0; transform: rotate(-25deg) scale(0.5);';
  }

  if (direction === 'right' && (transitionState === 'exiting' || transitionState === 'exiting')) {
    return 'opacity: 0; transform: rotate(25deg) scale(0.5);';
  }

  return '';
});

var TwistFadeTransition = function TwistFadeTransition(_ref3) {
  var inProp = _ref3.in,
      _children = _ref3.children,
      direction = _ref3.direction;

  if (!Transition) {
    return inProp ? _children : null;
  }

  return /*#__PURE__*/_jsx(Transition, {
    in: inProp,
    timeout: 200,
    appear: true,
    children: function children(state) {
      return /*#__PURE__*/_jsx(TransitionComponent, {
        direction: direction,
        transitionState: state,
        children: _children
      });
    }
  });
};

TwistFadeTransition.defaultProps = {
  direction: 'right',
  in: true
};
TwistFadeTransition.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['left', 'right']),
  in: PropTypes.bool.isRequired
};
TwistFadeTransition.displayName = 'TwistFadeTransition';
export default TwistFadeTransition;