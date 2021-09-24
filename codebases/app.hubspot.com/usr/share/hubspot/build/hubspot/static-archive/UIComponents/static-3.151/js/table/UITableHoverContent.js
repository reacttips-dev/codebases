'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { GRID_BREAKPOINT_MEDIUM } from 'HubStyleTokens/sizes';
import { closest } from '../utils/Dom';
import Controllable from '../decorators/Controllable';
import SyntheticEvent from '../core/SyntheticEvent';
import memoizeOne from 'react-utils/memoizeOne';
import { isPageInKeyboardMode } from '../listeners/focusStylesListener';

var getClosestTable = function getClosestTable(el) {
  return closest(el, 'TABLE');
};

var getClosestTableRow = function getClosestTableRow(el) {
  return closest(el, 'TR');
};

var bindEventListeners = function bindEventListeners(instance) {
  // Add event listeners to the row and table this component lives in
  var table = getClosestTable(instance._el);
  var tr = getClosestTableRow(instance._el);
  if (!tr || !table) return;
  table.addEventListener('mouseleave', instance.handleRowOrTableMouseLeave);
  tr.addEventListener('mouseleave', instance.handleRowOrTableMouseLeave);
  tr.addEventListener('mouseenter', instance.handleRowMouseEnter);
  tr.addEventListener('focus', instance.handleRowFocus, true);
  tr.addEventListener('blur', instance.handleRowBlur, true); // If the user clicks a control with a mouse, we want to ignore the focus on that control (#3054)

  tr.addEventListener('mouseup', instance.handleRowBlur);
};

var unbindEventListeners = function unbindEventListeners(instance) {
  // Clean up any event handlers we've added to other elements
  var table = getClosestTable(instance._el);
  var tr = getClosestTableRow(instance._el);
  if (!tr || !table) return;
  table.removeEventListener('mouseleave', instance.handleRowOrTableMouseLeave);
  tr.removeEventListener('mouseenter', instance.handleRowMouseEnter);
  tr.removeEventListener('mouseleave', instance.handleRowOrTableMouseLeave);
  tr.removeEventListener('focus', instance.handleRowFocus, true);
  tr.removeEventListener('blur', instance.handleRowBlur, true);
  tr.removeEventListener('mouseup', instance.handleRowBlur);
};

var getStyle = function getStyle(style, top, left) {
  return Object.assign({}, style, {
    top: top,
    left: left
  });
};

var Span = styled.span.withConfig({
  displayName: "UITableHoverContent__Span",
  componentId: "ffmchv-0"
})(["@media only screen and (max-width:", "){white-space:nowrap;}opacity:", ";position:", ";&.private-table-hover-content--abs-pos{left:0 !important;position:absolute !important;top:0 !important;}"], GRID_BREAKPOINT_MEDIUM, function (_ref) {
  var open = _ref.open;
  return !open && 0;
}, function (_ref2) {
  var shrinkOnHide = _ref2.shrinkOnHide,
      open = _ref2.open;
  return shrinkOnHide && !open && 'absolute';
});

var UITableHoverContent = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITableHoverContent, _PureComponent);

  function UITableHoverContent(props) {
    var _this;

    _classCallCheck(this, UITableHoverContent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITableHoverContent).call(this, props));

    _this.checkForOpenDropdown = function () {
      if (!_this._el) return;
      var rowHasOpenDropdown = !!_this._el.querySelector('[data-dropdown-open="true"]');

      if (_this.state.rowHasOpenDropdown !== rowHasOpenDropdown) {
        _this.setState({
          rowHasOpenDropdown: rowHasOpenDropdown
        });
      }
    };

    _this.handleRowMouseEnter = function () {
      _this.setState({
        rowHasMouse: true
      });
    };

    _this.handleRowOrTableMouseLeave = function () {
      // Sometimes mouseleave is triggered on the <table> but not the <tr>
      if (_this.state.rowHasMouse) {
        _this.setState({
          rowHasMouse: false
        });
      }
    };

    _this.handleRowFocus = function () {
      // Handle focus events only if the user is interacting using the keyboard (#8548)
      _this.setState(function () {
        return isPageInKeyboardMode() ? {
          rowHasFocus: true
        } : null;
      });
    };

    _this.handleRowBlur = function () {
      _this.setState({
        rowHasFocus: false
      });
    };

    _this.state = {
      top: null,
      left: null,
      rowHasFocus: false,
      rowHasMouse: false,
      rowHasOpenDropdown: false
    };
    _this._getStyle = memoizeOne(getStyle);
    return _this;
  }

  _createClass(UITableHoverContent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this._isMounted = true;
      requestAnimationFrame(function () {
        bindEventListeners(_this2);

        _this2.checkForOpenDropdown();

        if (_this2._el) {
          _this2._observer = new MutationObserver(_this2.checkForOpenDropdown);

          _this2._observer.observe(_this2._el, {
            attributes: true,
            childList: true,
            subtree: true
          });
        }
      });
    }
  }, {
    key: "UNSAFE_componentWillUpdate",
    value: function UNSAFE_componentWillUpdate(nextProps) {
      var open = this.props.open;
      if (!this._isMounted) return; // In shrinkOnHide mode, compute our absolute position before hiding (#2412)

      if (nextProps.shrinkOnHide && open && !nextProps.open) {
        var _this$computeAbsolute = this.computeAbsolutePosition(),
            top = _this$computeAbsolute.top,
            left = _this$computeAbsolute.left;

        if (top !== this.state.top || left !== this.state.left) {
          this.setState({
            top: top,
            left: left
          });
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var onOpenChange = this.props.onOpenChange;
      var _this$state = this.state,
          rowHasFocus = _this$state.rowHasFocus,
          rowHasMouse = _this$state.rowHasMouse,
          rowHasOpenDropdown = _this$state.rowHasOpenDropdown; // These state checks prevent infinite update loops when `open` is controlled.

      if (rowHasFocus !== prevState.rowHasFocus || rowHasMouse !== prevState.rowHasMouse || rowHasOpenDropdown !== prevState.rowHasOpenDropdown) {
        var shouldBeOpen = rowHasFocus || rowHasMouse || rowHasOpenDropdown;
        onOpenChange(SyntheticEvent(shouldBeOpen));
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
      unbindEventListeners(this);
      if (this._observer) this._observer.disconnect();
    }
  }, {
    key: "computeAbsolutePosition",
    value: function computeAbsolutePosition() {
      // If we're visible but have shrinkOnHide, compute our absolute position.
      // Applying position: absolute implies display: block, so we set
      // display: block in the initial measurement to prevent discrepancies.
      this._el.classList.add('display-block');

      var _this$_el$getBounding = this._el.getBoundingClientRect(),
          left = _this$_el$getBounding.left,
          top = _this$_el$getBounding.top;

      this._el.classList.remove('display-block'); // This measurement tells us how far position: absolute moves us,
      // with top and left set to 0.


      this._el.classList.add('private-table-hover-content--abs-pos');

      var _this$_el$getBounding2 = this._el.getBoundingClientRect(),
          absLeft = _this$_el$getBounding2.left,
          absTop = _this$_el$getBounding2.top;

      this._el.classList.remove('private-table-hover-content--abs-pos'); // We take the difference between the two measurements as the appropriate
      // top and left values to apply while hidden.


      return {
        left: left - absLeft,
        top: top - absTop
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          __onOpenChange = _this$props.onOpenChange,
          open = _this$props.open,
          shrinkOnHide = _this$props.shrinkOnHide,
          style = _this$props.style,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "onOpenChange", "open", "shrinkOnHide", "style"]);

      var _this$state2 = this.state,
          top = _this$state2.top,
          left = _this$state2.left;
      var computedClassName = classNames('table-hover-content', className);
      return /*#__PURE__*/_jsx(Span, Object.assign({
        open: open,
        shrinkOnHide: shrinkOnHide,
        className: computedClassName,
        ref: function ref(_ref3) {
          _this3._el = findDOMNode(_ref3);
        },
        style: open || !shrinkOnHide ? style : this._getStyle(style, top, left)
      }, rest, {
        children: children
      }));
    }
  }]);

  return UITableHoverContent;
}(PureComponent);

UITableHoverContent.propTypes = {
  children: PropTypes.node.isRequired,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  shrinkOnHide: PropTypes.bool.isRequired
};
UITableHoverContent.defaultProps = {
  open: false,
  shrinkOnHide: false
};
UITableHoverContent.displayName = 'UITableHoverContent';
export default Controllable(UITableHoverContent, ['open']);