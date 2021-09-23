'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { closest, elementHasClass, moveFocusToNext } from '../utils/Dom';
import { uniqueId } from '../utils/underscore';
import passthroughProps from '../utils/propTypes/passthroughProps';
import Controllable from '../decorators/Controllable';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { createRef, cloneElement, Children, PureComponent } from 'react';
import { memoizedSequence } from '../core/Functions';
import { nodeDisplayNameMatches } from '../core/ReactNodes';
import SyntheticEvent from '../core/SyntheticEvent';
import { hidden } from '../utils/propTypes/decorators';
import UIAbstractDropdown from './abstract/UIAbstractDropdown';
import UIAbstractDropdownWithSearchbox from './abstract/UIAbstractDropdownWithSearchbox';
import UIPopover from '../tooltip/UIPopover';
import { PLACEMENTS } from '../tooltip/PlacementConstants';
import refObject from '../utils/propTypes/refObject';
import { wrapPropTypes } from '../utils/propTypes/wrapPropTypes';
import { DropdownContextProvider } from '../context/DropdownContext';
var USE_CLASSES = {
  list: 'private-dropdown--list',
  unstyled: ''
};

var UIDropdown = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIDropdown, _PureComponent);

  function UIDropdown(props) {
    var _this;

    _classCallCheck(this, UIDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIDropdown).call(this, props));

    _this.menuRefCallback = function (ref) {
      _this._menuEl = ref;
      if (ref) _this.checkForSearchbox();
    };

    _this.handleOpenComplete = function () {
      var _this$props = _this.props,
          onOpenComplete = _this$props.onOpenComplete,
          use = _this$props.use;

      if (!(_this.state.hasSearchbox || use === 'unstyled')) {
        // Move the focus to the first menu item (<li>).
        _this.focusNextMenuItem();
      }

      if (onOpenComplete) onOpenComplete();
    };

    _this.handleMenuClick = function (evt) {
      var _this$props2 = _this.props,
          closeOnMenuClick = _this$props2.closeOnMenuClick,
          onOpenChange = _this$props2.onOpenChange;

      if (closeOnMenuClick) {
        var target = evt.target;
        var iterableTarget = target;
        if (!closest(target, '[data-dropdown-menu]')) return; // Portals! #6595

        while (iterableTarget && !elementHasClass(iterableTarget, 'private-dropdown') && iterableTarget.getAttribute('data-component-name') !== 'UIFileButton') {
          // Only close when clicking a `button` or `a` tag!
          if ((['BUTTON', 'A'].includes(iterableTarget.nodeName) || iterableTarget.getAttribute('data-uic-allow-dropdown-close') === 'true') && !iterableTarget.disabled) {
            onOpenChange(SyntheticEvent(false));
            return;
          }

          iterableTarget = iterableTarget.parentElement;
        }
      }
    };

    _this.handleSearchChange = function () {
      _this.forceUpdate(); // Reposition the Tether after the search results flush to the DOM

    };

    _this.handleKeyDown = function (evt) {
      var key = evt.key;
      var _this$props3 = _this.props,
          onOpenChange = _this$props3.onOpenChange,
          open = _this$props3.open,
          use = _this$props3.use;
      if (!open) return;

      if (_this.state.hasSearchbox) {
        if (key === 'Enter') {
          onOpenChange(SyntheticEvent(false));
        }

        evt.stopPropagation();
        return;
      } // Move the focus to the next/prev menu item (<li>).


      if (use !== 'unstyled' && (key === 'ArrowDown' || key === 'ArrowUp')) {
        if (_this.focusNextMenuItem(key === 'ArrowUp')) {
          evt.preventDefault();
        }

        evt.stopPropagation();
      }
    };

    _this.renderContent = function () {
      var _this$props4 = _this.props,
          children = _this$props4.children,
          Content = _this$props4.Content;
      var hasSearchbox = _this.state.hasSearchbox;
      var mutatedChildren = children;

      if (hasSearchbox && !Content) {
        mutatedChildren = Children.map(children, function (child) {
          if (nodeDisplayNameMatches(child, /UITypeahead|UIGroupedTypeahead/)) {
            return /*#__PURE__*/cloneElement(child, {
              autoFocus: _this._enableAutofocus ? true : child.props.autoFocus,
              onSearchChange: memoizedSequence(child.props.onSearchChange, _this.handleSearchChange)
            });
          }

          return child;
        });
      }

      return /*#__PURE__*/_jsx("div", {
        "data-dropdown-menu": true,
        id: _this._id,
        onClick: _this.handleMenuClick,
        ref: _this.menuRefCallback,
        role: "presentation",
        children: Content ? /*#__PURE__*/_jsx(Content, {}) : mutatedChildren
      });
    };

    _this.state = {
      hasSearchbox: false
    };
    _this._id = "dropdown-menu-" + uniqueId();
    _this.popoverRef = /*#__PURE__*/createRef();
    _this._dropdownCtxValue = {
      shouldLogModalWarning: true
    };
    return _this;
  }

  _createClass(UIDropdown, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      // Only autofocus when `open` prop goes from false => true
      if (!this.props.open && nextProps.open) {
        this._enableAutofocus = true;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.checkForSearchbox(); // Reposition the Tether, as the results list may have changed height.

      if (this.popoverRef.current) this.popoverRef.current.reposition();
    }
  }, {
    key: "checkForSearchbox",
    value: function checkForSearchbox() {
      // Check if we have a searchbox, as we may need to make the arrow color match.
      if (this._menuEl && document.body.contains(this._menuEl)) {
        var hasSearchbox = !!this._menuEl.querySelector('.private-typeahead:not(.hide-search)');

        if (this.state.hasSearchbox !== hasSearchbox) {
          this.setState({
            hasSearchbox: hasSearchbox
          });
        }
      }
    }
  }, {
    key: "focusNextMenuItem",
    value: function focusNextMenuItem() {
      var reverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var menu = document.getElementById(this._id);
      return moveFocusToNext('li', menu, reverse);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          autoPlacement = _this$props5.autoPlacement,
          buttonClassName = _this$props5.buttonClassName,
          buttonText = _this$props5.buttonText,
          buttonUse = _this$props5.buttonUse,
          children = _this$props5.children,
          className = _this$props5.className,
          __closeOnMenuClick = _this$props5.closeOnMenuClick,
          __Content = _this$props5.Content,
          dropdownClassName = _this$props5.dropdownClassName,
          locked = _this$props5.locked,
          iconName = _this$props5.iconName,
          popoverProps = _this$props5.popoverProps,
          popoverRef = _this$props5.popoverRef,
          use = _this$props5.use,
          rest = _objectWithoutProperties(_this$props5, ["autoPlacement", "buttonClassName", "buttonText", "buttonUse", "children", "className", "closeOnMenuClick", "Content", "dropdownClassName", "locked", "iconName", "popoverProps", "popoverRef", "use"]);

      var containsFooter = Children.toArray(children).some(function (child) {
        return nodeDisplayNameMatches(child, /UIDropdownFooter/);
      });
      var computedDropdownClassName = classNames(className, dropdownClassName, USE_CLASSES[use], containsFooter && 'p-y-0');
      var defaultIcon = buttonText ? undefined : 'settings';
      return /*#__PURE__*/_jsx(DropdownContextProvider, {
        value: this._dropdownCtxValue,
        children: /*#__PURE__*/_jsx(UIAbstractDropdownWithSearchbox, Object.assign({}, rest, {
          autoPlacement: autoPlacement,
          buttonText: buttonText,
          buttonUse: buttonUse,
          className: buttonClassName,
          Content: this.renderContent,
          dropdownClassName: computedDropdownClassName,
          hasSearchbox: this.state.hasSearchbox,
          iconName: iconName !== undefined ? iconName : defaultIcon,
          locked: locked,
          onOpenComplete: this.handleOpenComplete,
          onKeyDown: this.handleKeyDown,
          popoverRef: popoverRef || this.popoverRef,
          popoverProps: popoverProps,
          children: children
        }))
      });
    }
  }]);

  return UIDropdown;
}(PureComponent);

UIDropdown.propTypes = Object.assign({}, wrapPropTypes(UIAbstractDropdown), {
  arrowColor: hidden(UIAbstractDropdown.propTypes.arrowColor),
  buttonClassName: PropTypes.string,
  closeOnMenuClick: PropTypes.bool.isRequired,
  placement: PropTypes.oneOf(PLACEMENTS),
  popoverProps: passthroughProps(UIPopover),
  popoverRef: refObject,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)).isRequired
});
UIDropdown.defaultProps = Object.assign({}, UIAbstractDropdown.defaultProps, {
  buttonUse: 'tertiary-light',
  closeOnMenuClick: true,
  menuWidth: 'auto',
  pinToConstraint: true,
  use: 'list'
});
UIDropdown.displayName = 'UIDropdown';
export default Controllable(UIDropdown, ['open']);