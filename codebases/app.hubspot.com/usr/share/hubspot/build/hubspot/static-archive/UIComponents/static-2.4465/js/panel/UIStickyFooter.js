'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { KOALA, OLAF } from 'HubStyleTokens/colors';
import { JUPITER_LAYER } from 'HubStyleTokens/sizes';
import { SLIDEIN_MODAL_TRANSITION_TIMING } from 'HubStyleTokens/times';
import TwoWayTransition from '../transitions/TwoWayTransition';
import UILayer from '../layer/UILayer';
import memoizeOne from 'react-utils/memoizeOne';

var getTransitionProps = function getTransitionProps(animateOnMount) {
  return {
    transitionOnMount: animateOnMount
  };
};

var transitionTime = parseInt(SLIDEIN_MODAL_TRANSITION_TIMING, 10);
var StickyFooter = styled(function (props) {
  var __sandboxed = props.sandboxed,
      rest = _objectWithoutProperties(props, ["sandboxed"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, rest));
}).withConfig({
  displayName: "UIStickyFooter__StickyFooter",
  componentId: "sc-1yb7dzp-0"
})(["background:", ";border-top:1px solid ", ";bottom:0;left:0;position:", ";right:0;z-index:", ";"], OLAF, KOALA, function (_ref) {
  var sandboxed = _ref.sandboxed;
  return sandboxed ? 'absolute' : 'fixed';
}, JUPITER_LAYER);
var StickyFooterTransitionWrapper = styled(function (props) {
  var open = props.open,
      transitioning = props.transitioning,
      rest = _objectWithoutProperties(props, ["open", "transitioning"]);

  return /*#__PURE__*/_jsx(TwoWayTransition.PlainWrapper, Object.assign({
    "data-component-name": "UIStickyFooter",
    "data-open-complete": open && !transitioning
  }, rest));
}).withConfig({
  displayName: "UIStickyFooter__StickyFooterTransitionWrapper",
  componentId: "sc-1yb7dzp-1"
})(["", "{transition-property:", ";transition-duration:", "ms;transform:", ";}"], StickyFooter, function (_ref2) {
  var transitionActive = _ref2.transitionActive;
  return transitionActive ? 'transform' : 'none';
}, transitionTime, function (_ref3) {
  var open = _ref3.open;
  return "translateY(" + (open ? '0' : '100') + "%)";
});

function StickyFooterTransition(props) {
  return /*#__PURE__*/_jsx(TwoWayTransition, Object.assign({}, props, {
    duration: transitionTime,
    Wrapper: StickyFooterTransitionWrapper
  }));
}

var UIStickyFooter = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIStickyFooter, _PureComponent);

  function UIStickyFooter(props) {
    var _this;

    _classCallCheck(this, UIStickyFooter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIStickyFooter).call(this, props));
    _this._getTransitionProps = memoizeOne(getTransitionProps);
    return _this;
  }

  _createClass(UIStickyFooter, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          animateOnMount = _this$props.animateOnMount,
          className = _this$props.className,
          rest = _objectWithoutProperties(_this$props, ["animateOnMount", "className"]);

      var sandboxed = this.context.sandboxed;

      var renderedFooter = /*#__PURE__*/_jsx(StickyFooter, Object.assign({}, rest, {
        className: classNames(className, 'private-sticky-footer'),
        sandboxed: sandboxed
      }));

      return sandboxed ? renderedFooter : /*#__PURE__*/_jsx(UILayer, {
        "data-layer-for": "UIStickyFooter",
        Transition: StickyFooterTransition,
        transitionProps: this._getTransitionProps(animateOnMount),
        children: renderedFooter
      });
    }
  }]);

  return UIStickyFooter;
}(PureComponent);

UIStickyFooter.propTypes = {
  animateOnMount: PropTypes.bool.isRequired,
  children: PropTypes.node
};
UIStickyFooter.contextTypes = {
  sandboxed: PropTypes.bool
};
UIStickyFooter.defaultProps = {
  animateOnMount: true
};
UIStickyFooter.displayName = 'UIStickyFooter';
export default UIStickyFooter;