'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { SORBET } from 'HubStyleTokens/colors';
import { MERCURY_LAYER } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from '../core/Color';
import TwoWayTransition from '../transitions/TwoWayTransition';

var getBoxShadow = function getBoxShadow(boxShadow, radius, color) {
  if (typeof boxShadow === 'string') return boxShadow;
  return boxShadow === true ? "0 0 " + radius + "px " + rgba(color, 0.5) : undefined;
};

var NanoProgressTransitionWrapper = styled(TwoWayTransition.PlainWrapper).withConfig({
  displayName: "UINanoProgress__NanoProgressTransitionWrapper",
  componentId: "hhf79m-0"
})(["transition:opacity 200ms ease;opacity:", ";"], function (_ref) {
  var closing = _ref.closing;
  return closing ? 0 : 1;
});
var Bar = styled.div.withConfig({
  displayName: "UINanoProgress__Bar",
  componentId: "hhf79m-1"
})(["left:0;position:absolute;top:0;width:100%;z-index:", ";"], MERCURY_LAYER);
export default function UINanoProgress(props) {
  var animateOnComplete = props.animateOnComplete,
      boxShadow = props.boxShadow,
      className = props.className,
      color = props.color,
      height = props.height,
      value = props.value;
  return value >= 0 && /*#__PURE__*/_jsx(TwoWayTransition, {
    duration: 200,
    Wrapper: NanoProgressTransitionWrapper,
    className: className,
    children: animateOnComplete && value >= 100 ? null : /*#__PURE__*/_jsx(Bar, {
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": value,
      role: "progressbar",
      style: {
        width: value + "%",
        background: color,
        boxShadow: getBoxShadow(boxShadow, height * 3, color),
        height: height,
        transition: 'all 200ms ease'
      }
    })
  });
}
UINanoProgress.propTypes = {
  animateOnComplete: PropTypes.bool,
  boxShadow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  color: PropTypes.string,
  height: PropTypes.number,
  value: PropTypes.number
};
UINanoProgress.defaultProps = {
  animateOnComplete: false,
  boxShadow: true,
  color: SORBET,
  height: 2,
  value: 0
};
UINanoProgress.displayName = 'UINanoProgress';