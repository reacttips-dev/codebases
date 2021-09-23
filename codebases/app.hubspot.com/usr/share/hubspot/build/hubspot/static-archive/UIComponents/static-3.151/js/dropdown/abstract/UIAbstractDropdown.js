'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Component } from 'react';
import memoizeOne from 'react-utils/memoizeOne';
import UIButton from '../../button/UIButton';
import UIClickable from '../../button/UIClickable';
import { MIN_MENU_WIDTH } from '../../constants/Tether';
import { callIfPossible } from '../../core/Functions';
import SyntheticEvent from '../../core/SyntheticEvent';
import ShareButton from '../../decorators/ShareButton';
import UIIcon from '../../icon/UIIcon';
import { isPageInKeyboardMode } from '../../listeners/focusStylesListener';
import { PLACEMENTS, PLACEMENTS_SIDES } from '../../tooltip/PlacementConstants';
import UIControlledPopover from '../../tooltip/UIControlledPopover';
import UIPopoverArrow from '../../tooltip/internal/UIPopoverArrow';
import * as CustomRenderer from '../../utils/propTypes/customRenderer';
import { hidden } from '../../utils/propTypes/decorators';
import { getIconNamePropType } from '../../utils/propTypes/iconName';
import refObject from '../../utils/propTypes/refObject';
import { cancelSchedulerCallback, requestSchedulerCallback } from '../../utils/Timers';
import { uniqueId } from '../../utils/underscore';
import UIDropdownCaret from '../UIDropdownCaret';

var getArrowSize = function getArrowSize(buttonUse) {
  if (buttonUse.match(/link|transparent/)) {
    return 'medium';
  }

  return 'none';
};

var getPlacement = function getPlacement(placement, computedArrowSize) {
  if (placement) {
    return placement;
  } // Center if we have an arrow, otherwise flush left against the target


  if (computedArrowSize !== 'none') {
    return 'bottom';
  }

  return 'bottom right';
};

var getButtonClassName = function getButtonClassName(className, multiline, open, readOnly) {
  return classNames("private-button__dropdown-opener uiDropdown__button", className, multiline && 'private-button__dropdown-opener--multiline', open && 'private-button__dropdown-opener--open', readOnly && 'private-button--readonly');
};

var getStyle = function getStyle(menuWidth, controlWidth) {
  return {
    width: menuWidth || controlWidth,
    minWidth: menuWidth === 'auto' ? controlWidth : null
  };
};

var renderButtonLabel = function renderButtonLabel(buttonText, iconName, readOnly) {
  var buttonClassNames = "private-dropdown__button-label uiDropdown__buttonLabel" + (!iconName && !buttonText || readOnly ? " private-dropdown__button-label--no-icon" : "");
  var icon = iconName ? /*#__PURE__*/_jsx(UIIcon, {
    className: "private-dropdown__icon",
    name: iconName
  }) : null;
  return /*#__PURE__*/_jsxs("span", {
    className: buttonClassNames,
    children: [icon, buttonText == null || buttonText === '' ? "\u200B" : buttonText]
  });
};

var UIAbstractDropdown = /*#__PURE__*/function (_Component) {
  _inherits(UIAbstractDropdown, _Component);

  function UIAbstractDropdown(props) {
    var _this;

    _classCallCheck(this, UIAbstractDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIAbstractDropdown).call(this, props));
    _this.state = {
      controlWidth: 0
    };

    _this.measureControlWidth = function () {
      // Make the menu width match up with the anchor width
      var _this$props = _this.props,
          buttonRef = _this$props.buttonRef,
          open = _this$props.open;
      var controlEl = buttonRef.current;

      if (controlEl && open) {
        var controlWidth = _this.computeControlWidth(controlEl);

        if (controlWidth !== _this.state.controlWidth) {
          _this.setState({
            controlWidth: controlWidth
          });
        }
      }
    };

    _this.hasKeyboardFocus = function () {
      var buttonRef = _this.props.buttonRef;
      var activeElement = document.activeElement;
      var dropdownNode = document.getElementById(_this._contentId);

      if (!activeElement) {
        return false;
      }

      if (activeElement === buttonRef.current) {
        return true;
      } else if (dropdownNode && dropdownNode.contains(activeElement)) {
        return true;
      }

      return false;
    };

    _this.handleButtonClick = function (evt) {
      var _this$props2 = _this.props,
          locked = _this$props2.locked,
          open = _this$props2.open,
          onClick = _this$props2.onClick;
      callIfPossible(onClick, evt);

      if (!locked) {
        var nextOpen = !open;

        _this.setIsOpen(nextOpen);
      }
    };

    _this.handleWindowResize = function () {
      cancelSchedulerCallback(_this._resizeFrame);
      _this._resizeFrame = requestSchedulerCallback(_this.measureControlWidth);
    };

    _this.handleKeyDown = function (evt) {
      // Handle keydown events from both the button and the dropdown
      var _this$props3 = _this.props,
          onKeyDown = _this$props3.onKeyDown,
          open = _this$props3.open;

      if (open && evt.key === 'Escape') {
        _this.setIsOpen(false);

        evt.stopPropagation();
      }

      callIfPossible(onKeyDown, evt);
    };

    _this.setIsOpen = function (nextOpen) {
      var _this$props4 = _this.props,
          onOpenChange = _this$props4.onOpenChange,
          readOnly = _this$props4.readOnly;

      if (!onOpenChange || readOnly) {
        return;
      }

      onOpenChange(SyntheticEvent(nextOpen));
    };

    _this.focusOnControl = function () {
      // When focusing, reset the scroll coordinates to negate the browser's scroll behavior
      var buttonRef = _this.props.buttonRef;
      var _document$documentEle = document.documentElement,
          scrollLeft = _document$documentEle.scrollLeft,
          scrollTop = _document$documentEle.scrollTop;
      var controlNode = buttonRef.current;
      if (!controlNode) return;
      controlNode.focus();
      scrollTo(scrollLeft, scrollTop);
    };

    _this.computeControlWidth = function (controlEl) {
      var open = _this.props.open;

      if (!controlEl || !open) {
        return 0;
      }

      var exactWidth = controlEl.getBoundingClientRect().width;
      var roundedWidth = window.chrome ? Math.floor(exactWidth) : exactWidth;
      return roundedWidth - 2; // account for 1px border added by UIPopover
    };

    _this.renderContent = function () {
      var _this$props5 = _this.props,
          children = _this$props5.children,
          Content = _this$props5.Content,
          dropdownClassName = _this$props5.dropdownClassName,
          dropdownContentRef = _this$props5.dropdownContentRef,
          menuWidth = _this$props5.menuWidth,
          minMenuWidth = _this$props5.minMenuWidth;
      var controlWidth = Math.max(_this.state.controlWidth, minMenuWidth);
      return /*#__PURE__*/_jsx("div", {
        className: classNames("private-dropdown uiDropdown__dropdown", dropdownClassName),
        id: _this._contentId,
        onKeyDown: _this.handleKeyDown,
        ref: dropdownContentRef,
        role: "presentation",
        style: _this._getStyle(menuWidth, controlWidth),
        children: Content ? /*#__PURE__*/_jsx(Content, {}) : children
      });
    };

    _this._buttonContentId = uniqueId('uiabstractdropdown-button-content-');
    _this._contentId = uniqueId('uiabstractdropdown-content-');
    _this._getStyle = memoizeOne(getStyle);
    _this.shouldCloseOnClick = _this.shouldCloseOnClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(UIAbstractDropdown, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var open = this.props.open;

      if (open) {
        this.measureControlWidth();
        addEventListener('resize', this.handleWindowResize);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var open = this.props.open; // ⚠️ This condition prevents infinite loops! ⚠️

      if (prevState.controlWidth === this.state.controlWidth) {
        this.measureControlWidth();
      } // If the dropdown was closed via the keyboard, and the focus was within the dropdown, then give
      // keyboard focus to the control.


      if (prevProps.open && !open && this.hasKeyboardFocus() && isPageInKeyboardMode()) {
        this.focusOnControl();
      }

      if (!prevProps.open && open) {
        addEventListener('resize', this.handleWindowResize);
      } else if (prevProps.open && !open) {
        removeEventListener('resize', this.handleWindowResize);
        cancelSchedulerCallback(this._resizeFrame);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      removeEventListener('resize', this.handleWindowResize);
      cancelSchedulerCallback(this._resizeFrame);
    }
  }, {
    key: "shouldCloseOnClick",
    value: function shouldCloseOnClick(evt) {
      var _this$props6 = this.props,
          buttonRef = _this$props6.buttonRef,
          shouldCloseOnClick = _this$props6.shouldCloseOnClick; // If `shouldCloseOnClick` is provided and returns a non-null value, defer to it

      if (shouldCloseOnClick) {
        var shouldClose = shouldCloseOnClick(evt);
        if (shouldClose != null) return shouldClose;
      }

      var target = evt.target;
      var controlNode = buttonRef.current;
      if (!controlNode) return null; // Ignore clicks on any <label> that contain the button

      var parentEl = controlNode;

      while (parentEl.parentElement) {
        parentEl = parentEl.parentElement;

        if (parentEl.tagName === 'LABEL' && parentEl.contains(target)) {
          return false;
        }
      } // Ignore clicks on any <label> whose "for" attr points to the button


      var id = controlNode.id;

      if (id) {
        var labelsForControl = document.querySelectorAll("label[for=\"" + id + "\"]");

        for (var i = 0; i < labelsForControl.length; i++) {
          if (labelsForControl[i].contains(target)) {
            return false;
          }
        }
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          animateOnMount = _this$props7.animateOnMount,
          animateOnToggle = _this$props7.animateOnToggle,
          ariaExpanded = _this$props7['aria-expanded'],
          ariaLabelledby = _this$props7['aria-labelledby'],
          arrowColor = _this$props7.arrowColor,
          arrowSize = _this$props7.arrowSize,
          autoPlacement = _this$props7.autoPlacement,
          Button = _this$props7.Button,
          buttonRef = _this$props7.buttonRef,
          buttonSize = _this$props7.buttonSize,
          buttonText = _this$props7.buttonText,
          buttonUse = _this$props7.buttonUse,
          caretRenderer = _this$props7.caretRenderer,
          __children = _this$props7.children,
          className = _this$props7.className,
          closeOnOutsideClick = _this$props7.closeOnOutsideClick,
          closeOnTargetLeave = _this$props7.closeOnTargetLeave,
          __Content = _this$props7.Content,
          __dropdownClassName = _this$props7.dropdownClassName,
          __dropdownContentRef = _this$props7.dropdownContentRef,
          iconName = _this$props7.iconName,
          id = _this$props7.id,
          __locked = _this$props7.locked,
          __menuWidth = _this$props7.menuWidth,
          __minMenuWidth = _this$props7.minMenuWidth,
          multiline = _this$props7.multiline,
          onChangePlacement = _this$props7.onChangePlacement,
          __onClick = _this$props7.onClick,
          onFocusLeave = _this$props7.onFocusLeave,
          onOpenChange = _this$props7.onOpenChange,
          onOpenComplete = _this$props7.onOpenComplete,
          onOpenStart = _this$props7.onOpenStart,
          open = _this$props7.open,
          pinToConstraint = _this$props7.pinToConstraint,
          placement = _this$props7.placement,
          popoverProps = _this$props7.popoverProps,
          readOnly = _this$props7.readOnly,
          __shouldCloseOnClick = _this$props7.shouldCloseOnClick,
          _useNativeButton = _this$props7._useNativeButton,
          rest = _objectWithoutProperties(_this$props7, ["animateOnMount", "animateOnToggle", "aria-expanded", "aria-labelledby", "arrowColor", "arrowSize", "autoPlacement", "Button", "buttonRef", "buttonSize", "buttonText", "buttonUse", "caretRenderer", "children", "className", "closeOnOutsideClick", "closeOnTargetLeave", "Content", "dropdownClassName", "dropdownContentRef", "iconName", "id", "locked", "menuWidth", "minMenuWidth", "multiline", "onChangePlacement", "onClick", "onFocusLeave", "onOpenChange", "onOpenComplete", "onOpenStart", "open", "pinToConstraint", "placement", "popoverProps", "readOnly", "shouldCloseOnClick", "_useNativeButton"]);

      var computedArrowSize = arrowSize || getArrowSize(buttonUse);
      var computedButtonClassName = getButtonClassName(className, multiline, open, readOnly);
      var computedPlacement = getPlacement(placement, computedArrowSize);
      var renderedButtonLabel = renderButtonLabel(buttonText, iconName, readOnly);
      var renderedCaret = CustomRenderer.render(caretRenderer, {
        use: buttonUse
      });
      var ButtonType = Button || (buttonUse === 'unstyled' ? UIClickable : UIButton);
      var buttonProps = buttonUse === 'unstyled' ? {} : {
        _useNativeButton: _useNativeButton,
        size: buttonSize,
        use: buttonUse
      };
      var computedAriaExpanded = !!(ariaExpanded != null ? ariaExpanded : open) || undefined;
      return /*#__PURE__*/_jsx(UIControlledPopover, Object.assign({
        animateOnMount: animateOnMount,
        animateOnToggle: animateOnToggle,
        arrowColor: arrowColor,
        arrowSize: computedArrowSize,
        autoPlacement: autoPlacement,
        closeOnOutsideClick: closeOnOutsideClick,
        closeOnTargetLeave: closeOnTargetLeave,
        Content: this.renderContent,
        onFocusLeave: onFocusLeave,
        onChangePlacement: onChangePlacement,
        onOpenChange: onOpenChange,
        onOpenStart: onOpenStart,
        onOpenComplete: onOpenComplete,
        open: open,
        pinToConstraint: pinToConstraint,
        placement: computedPlacement,
        shouldCloseOnClick: this.shouldCloseOnClick
      }, popoverProps, {
        children: /*#__PURE__*/_jsx(ButtonType, Object.assign({}, rest, {}, buttonProps, {
          "aria-expanded": computedAriaExpanded,
          "aria-haspopup": true,
          "aria-labelledby": ariaLabelledby ? ariaLabelledby + " " + this._buttonContentId : this._buttonContentId,
          "aria-owns": this._contentId,
          className: computedButtonClassName,
          "data-dropdown-open": open,
          id: id,
          onClick: this.handleButtonClick,
          onKeyDown: this.handleKeyDown,
          buttonRef: buttonRef,
          children: /*#__PURE__*/_jsxs("span", {
            className: "uiDropdown__buttonContents private-dropdown__button__contents",
            id: this._buttonContentId,
            children: [renderedButtonLabel, !readOnly && renderedCaret]
          })
        }))
      }));
    }
  }]);

  return UIAbstractDropdown;
}(Component);

UIAbstractDropdown.propTypes = {
  animateOnMount: UIControlledPopover.propTypes.animateOnMount,
  animateOnToggle: UIControlledPopover.propTypes.animateOnToggle,
  'aria-expanded': hidden(PropTypes.bool),
  'aria-labelledby': PropTypes.string,
  arrowColor: PropTypes.string,
  arrowSize: PropTypes.oneOf(Object.keys(UIPopoverArrow.ARROW_SIZES)),
  autoPlacement: UIControlledPopover.propTypes.autoPlacement,
  Button: PropTypes.elementType,
  buttonRef: refObject.isRequired,
  buttonSize: UIButton.propTypes.size,
  buttonText: PropTypes.node,
  buttonUse: UIDropdownCaret.propTypes.use,
  caretRenderer: CustomRenderer.propType,
  children: PropTypes.node,
  closeOnOutsideClick: PropTypes.bool,
  closeOnTargetLeave: PropTypes.bool,
  Content: PropTypes.elementType,
  disabled: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  dropdownContentRef: hidden(PropTypes.func),
  iconName: getIconNamePropType(),
  locked: PropTypes.bool.isRequired,
  menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  minMenuWidth: PropTypes.number.isRequired,
  multiline: hidden(PropTypes.bool.isRequired),
  onChangePlacement: PropTypes.func,
  onFocusLeave: PropTypes.func,
  onOpenChange: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  open: PropTypes.bool.isRequired,
  pinToConstraint: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_SIDES))]),
  placement: PropTypes.oneOf(PLACEMENTS),
  popoverRef: refObject,
  popoverProps: PropTypes.object,
  readOnly: PropTypes.bool,
  shouldCloseOnClick: PropTypes.func,
  _useNativeButton: PropTypes.bool
};
UIAbstractDropdown.defaultProps = {
  animateOnMount: false,
  autoPlacement: 'dropdown',
  buttonSize: 'default',
  buttonUse: 'secondary',
  caretRenderer: /*#__PURE__*/_jsx(UIDropdownCaret, {}),
  closeOnOutsideClick: true,
  dropdownClassName: '',
  locked: false,
  minMenuWidth: MIN_MENU_WIDTH,
  multiline: false,
  open: false
};
UIAbstractDropdown.displayName = 'UIAbstractDropdown';
export default ShareButton(UIAbstractDropdown);