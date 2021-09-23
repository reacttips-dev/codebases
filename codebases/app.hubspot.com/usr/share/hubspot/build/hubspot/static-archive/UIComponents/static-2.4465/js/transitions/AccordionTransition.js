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
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import TwoWayTransition from './TwoWayTransition';
import { memoizedSequence } from '../core/Functions';
var AccordionTransitionWrapper = styled(function (_ref) {
  var open = _ref.open,
      __measuredHeight = _ref.measuredHeight,
      transitioning = _ref.transitioning,
      rest = _objectWithoutProperties(_ref, ["open", "measuredHeight", "transitioning"]);

  return /*#__PURE__*/_jsx(TwoWayTransition.PlainWrapper, Object.assign({
    "data-open-complete": open && !transitioning
  }, rest));
}).withConfig({
  displayName: "AccordionTransition__AccordionTransitionWrapper",
  componentId: "koorbm-0"
})(["transition:", ";height:", ";opacity:", ";pointer-events:", ";transform:", ";overflow:", ";"], function (_ref2) {
  var duration = _ref2.duration,
      measuredHeight = _ref2.measuredHeight,
      transitionActive = _ref2.transitionActive;
  return measuredHeight != null && transitionActive ? "height " + duration + "ms cubic-bezier(0.25, 0.1, 0.25, 1),\n    opacity " + duration + "ms cubic-bezier(0.42, 0, 0.58, 1),\n    transform " + duration + "ms cubic-bezier(0.42, 0, 0.58, 1)" : 'none';
}, function (_ref3) {
  var open = _ref3.open,
      measuredHeight = _ref3.measuredHeight,
      transitioning = _ref3.transitioning;
  return transitioning && (open ? measuredHeight + "px" : 0);
}, function (_ref4) {
  var open = _ref4.open,
      transitioning = _ref4.transitioning;
  return transitioning && (open ? 1 : 0);
}, function (_ref5) {
  var transitioning = _ref5.transitioning;
  return transitioning && 'none';
}, function (_ref6) {
  var open = _ref6.open,
      transitioning = _ref6.transitioning;
  return transitioning && "translateY(" + (open ? '0' : '-10px') + ")";
}, function (_ref7) {
  var open = _ref7.open,
      transitioning = _ref7.transitioning;
  return !open || transitioning ? 'hidden' : 'visible';
});

var AccordionTransition = /*#__PURE__*/function (_PureComponent) {
  _inherits(AccordionTransition, _PureComponent);

  function AccordionTransition(props) {
    var _this;

    _classCallCheck(this, AccordionTransition);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AccordionTransition).call(this, props));

    _this.handleTransitionStart = function () {
      _this.setState({
        transitioning: true
      });
    };

    _this.handleTransitionComplete = function () {
      _this.setState({
        transitioning: false
      });
    };

    _this.state = {
      measuredHeight: 0,
      // 0 = not needed, null = needed
      transitioning: false
    };
    return _this;
  }

  _createClass(AccordionTransition, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.open !== nextProps.open && !this.state.transitioning) {
        this.setState({
          measuredHeight: null
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.measuredHeight == null) {
        this.measureHeight();
      }
    }
  }, {
    key: "measureHeight",
    value: function measureHeight() {
      var el = findDOMNode(this);
      if (!el) return;
      this.setState({
        measuredHeight: el.scrollHeight
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          Content = _this$props.Content,
          renderContent = _this$props.renderContent,
          duration = _this$props.duration,
          onOpenStart = _this$props.onOpenStart,
          onCloseStart = _this$props.onCloseStart,
          onOpenComplete = _this$props.onOpenComplete,
          onCloseComplete = _this$props.onCloseComplete,
          open = _this$props.open,
          rest = _objectWithoutProperties(_this$props, ["children", "Content", "renderContent", "duration", "onOpenStart", "onCloseStart", "onOpenComplete", "onCloseComplete", "open"]);

      var renderedContent = null;

      if (open) {
        if (Content) {
          renderedContent = /*#__PURE__*/_jsx(Content, {});
        } else if (renderContent) {
          renderedContent = renderContent();
        } else {
          renderedContent = children;
        }
      }

      return /*#__PURE__*/_jsx(TwoWayTransition, Object.assign({}, rest, {
        duration: duration,
        measuredHeight: this.state.measuredHeight,
        onOpenStart: memoizedSequence(this.handleTransitionStart, onOpenStart),
        onCloseStart: memoizedSequence(this.handleTransitionStart, onCloseStart),
        onOpenComplete: memoizedSequence(this.handleTransitionComplete, onOpenComplete),
        onCloseComplete: memoizedSequence(this.handleTransitionComplete, onCloseComplete),
        children: renderedContent
      }));
    }
  }]);

  return AccordionTransition;
}(PureComponent);

AccordionTransition.propTypes = {
  children: PropTypes.node,
  Content: PropTypes.elementType,
  renderContent: PropTypes.func,
  duration: PropTypes.number.isRequired,
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  open: PropTypes.bool.isRequired,
  Wrapper: PropTypes.elementType.isRequired
};
AccordionTransition.defaultProps = {
  duration: 200,
  Wrapper: AccordionTransitionWrapper
};
AccordionTransition.displayName = 'AccordionTransition';
export default AccordionTransition;