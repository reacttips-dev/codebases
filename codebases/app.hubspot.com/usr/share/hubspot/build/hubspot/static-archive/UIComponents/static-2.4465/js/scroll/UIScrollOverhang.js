'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Children, cloneElement, PureComponent, createRef } from 'react';
import shallowEqual from 'react-utils/shallowEqual';
import styled from 'styled-components';
import { isIE11 } from '../utils/BrowserTest';
import { callIfPossible } from '../core/Functions';
import { warnIfFragment } from '../utils/devWarnings';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { cancelSchedulerCallback, requestSchedulerCallback } from '../utils/Timers';
import UIOverhang from './UIOverhang';
var sides = ['top', 'bottom', 'left', 'right'];
var Wrapper = styled.div.withConfig({
  displayName: "UIScrollOverhang__Wrapper",
  componentId: "sc-1owelph-0"
})(["position:relative;min-height:0;"]);

var UIScrollOverhang = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIScrollOverhang, _PureComponent);

  function UIScrollOverhang() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIScrollOverhang);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIScrollOverhang)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleScroll = function (evt) {
      callIfPossible(_this.props.onScroll, evt);

      _this.delayedMeasureScrollableArea();
    };

    _this.delayedMeasureScrollableArea = function () {
      cancelSchedulerCallback(_this._timeout); // Ensure only one callback is queued at a time

      _this._timeout = requestSchedulerCallback(_this.measureScrollableArea);
    };

    _this.measureScrollableArea = function () {
      var thisEl = _this.wrapperRef.current; // Bail out if our only children are the 4 scroll overhang elements

      if (thisEl == null || thisEl.children.length === 4) return;
      var childEl = thisEl.children[0];
      var computedStyles = getComputedStyle(childEl, null); // Patch for Firefox < 62: https://bugzilla.mozilla.org/show_bug.cgi?id=1467722

      if (computedStyles == null) return;
      var clientHeight = childEl.clientHeight,
          clientWidth = childEl.clientWidth,
          scrollHeight = childEl.scrollHeight,
          scrollLeft = childEl.scrollLeft,
          scrollTop = childEl.scrollTop,
          scrollWidth = childEl.scrollWidth;

      var isScrollable = function isScrollable(overflow) {
        return overflow === 'auto' || overflow === 'scroll';
      };

      var scrollsVertically = isScrollable(computedStyles.overflowY);
      var scrollsHorizontally = isScrollable(computedStyles.overflowX);
      var measuredScrollableArea = {
        top: scrollsVertically ? scrollTop : 0,
        bottom: scrollsVertically ? scrollHeight - clientHeight - scrollTop : 0,
        left: scrollsHorizontally ? scrollLeft : 0,
        right: scrollsHorizontally ? scrollWidth - clientWidth - scrollLeft : 0
      };

      if (!shallowEqual(measuredScrollableArea, _this.state.measuredScrollableArea)) {
        _this.setState({
          measuredScrollableArea: measuredScrollableArea
        });
      }
    };

    _this.state = {
      measuredScrollableArea: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    };
    _this.wrapperRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(UIScrollOverhang, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // IE needs a longer delay before measurement, or else it sometimes returns an absurdly large
      // scrollWidth.
      if (isIE11()) {
        this._frame = requestAnimationFrame(function () {
          _this2._frame = requestAnimationFrame(_this2.measureScrollableArea);
        });
      } else {
        this.delayedMeasureScrollableArea();
      }

      var thisEl = this.wrapperRef.current;
      this.resizeObserver = new ResizeObserver(this.delayedMeasureScrollableArea);
      this.resizeObserver.observe(thisEl);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevState.measuredScrollableArea === this.state.measuredScrollableArea) {
        this.delayedMeasureScrollableArea();
      }

      var thisEl = this.wrapperRef.current;
      this.resizeObserver = new ResizeObserver(this.delayedMeasureScrollableArea);
      this.resizeObserver.observe(thisEl);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var thisEl = this.wrapperRef.current;
      this.resizeObserver.unobserve(thisEl);
      cancelSchedulerCallback(this._timeout);
      cancelAnimationFrame(this._frame);
    }
  }, {
    key: "getClonedChild",
    value: function getClonedChild(children, measuredScrollableArea) {
      var child = Children.only(children);
      warnIfFragment(children, UIScrollOverhang.displayName);
      var childTabIndex = child.props && child.props.tabIndex;
      var childIsScrollable = sides.some(function (side) {
        return measuredScrollableArea[side] > 0;
      });
      var clonedElement = /*#__PURE__*/cloneElement(child, {
        tabIndex: childIsScrollable ? childTabIndex || 0 : childTabIndex,
        onScroll: this.handleScroll
      });
      return clonedElement;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          forceOverhangs = _this$props.forceOverhangs,
          gradientColor = _this$props.gradientColor,
          Overhang = _this$props.Overhang,
          size = _this$props.size,
          __onScroll = _this$props.onScroll,
          rest = _objectWithoutProperties(_this$props, ["children", "forceOverhangs", "gradientColor", "Overhang", "size", "onScroll"]);

      var measuredScrollableArea = this.state.measuredScrollableArea;
      var clonedChild = this.getClonedChild(children, measuredScrollableArea);
      var overhangProps = {
        gradientColor: gradientColor,
        size: size
      }; // Fade smoothly from 1 (scrollable area exceeds overhang size) to 0 (no scrollable area)

      var getOpacity = function getOpacity(side) {
        return forceOverhangs[side] ? 1 : Math.min((measuredScrollableArea[side] || 0) / size, 1);
      };

      return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
        ref: this.wrapperRef,
        children: [clonedChild, /*#__PURE__*/_jsx(Overhang, Object.assign({}, overhangProps, {
          opacity: getOpacity('top'),
          side: "top"
        })), /*#__PURE__*/_jsx(Overhang, Object.assign({}, overhangProps, {
          opacity: getOpacity('bottom'),
          side: "bottom"
        })), /*#__PURE__*/_jsx(Overhang, Object.assign({}, overhangProps, {
          opacity: getOpacity('left'),
          side: "left"
        })), /*#__PURE__*/_jsx(Overhang, Object.assign({}, overhangProps, {
          opacity: getOpacity('right'),
          side: "right"
        }))]
      }));
    }
  }]);

  return UIScrollOverhang;
}(PureComponent);

UIScrollOverhang.propTypes = {
  children: PropTypes.element.isRequired,
  forceOverhangs: PropTypes.shape({
    top: PropTypes.bool,
    bottom: PropTypes.bool,
    left: PropTypes.bool,
    right: PropTypes.bool
  }).isRequired,
  gradientColor: UIOverhang.propTypes.gradientColor,
  onScroll: PropTypes.func,
  Overhang: getComponentPropType(UIOverhang),
  size: UIOverhang.propTypes.size
};
UIScrollOverhang.defaultProps = {
  forceOverhangs: {
    top: false,
    bottom: false,
    left: false,
    right: false
  },
  gradientColor: UIOverhang.defaultProps.gradientColor,
  Overhang: UIOverhang,
  size: UIOverhang.defaultProps.size
};
UIScrollOverhang.displayName = 'UIScrollOverhang';
export default UIScrollOverhang;