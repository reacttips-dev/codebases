'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { first, last } from '../utils/underscore';
import PropTypes from 'prop-types';
import { Children, Component } from 'react';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
import memoizeOne from 'react-utils/memoizeOne';
import { findDOMNode } from 'react-dom';
import { FOCUSABLE as FOCUSABLE_SELECTOR } from '../constants/Selectors';
import UIDialog from './UIDialog';
import UIDialogCloseButton from './UIDialogCloseButton';
import UIOverlay from '../overlay/UIOverlay';
import { matches } from '../utils/Dom';
import { hidden } from '../utils/propTypes/decorators';
import { SIZE_CLASSES, DIALOG_USE_CLASSES } from './DialogConstants';
import { ModalContextProvider } from '../context/ModalContext';

var getContext = function getContext(use, headerCallback) {
  return {
    use: use,
    headerCallback: headerCallback
  };
};

var hasPingedNewRelic = false; // Report "special" modals that lack a proper header (#6712)

var reportDeprecatedModalMarkup = function reportDeprecatedModalMarkup(el) {
  if (!el) return;
  if (el.querySelector('.private-modal__header + .private-modal__body')) return;
  ['success', 'danger', 'info'].forEach(function (variant) {
    for (var headingLevel = 1; headingLevel <= 6; headingLevel++) {
      if (el.querySelector(".private-modal--" + variant + " .private-modal__body h" + headingLevel)) {
        if (process.env.NODE_ENV !== 'production') {
          devLogger.warn({
            message: "Modals with `use=\"" + variant + "\"` should wrap their heading in a `UIDialogHeader`.",
            key: 'legacy-modal-markup'
          });
        }

        if (window.newrelic && !hasPingedNewRelic) {
          window.newrelic.addPageAction('legacy-modal', {
            variant: variant,
            headingLevel: headingLevel
          });
          hasPingedNewRelic = true;
        }
      }
    }
  });
};

var UIModalDialog = /*#__PURE__*/function (_Component) {
  _inherits(UIModalDialog, _Component);

  function UIModalDialog(props) {
    var _this;

    _classCallCheck(this, UIModalDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIModalDialog).call(this, props));

    _this.handleOpenComplete = function () {
      _this.setState({
        openComplete: true
      });

      _this.startMutationObserver();

      _this.captureFocus();
    };

    _this.handleCloseStart = function () {
      if (!_this._isMounted) return;

      _this.stopMutationObserver();
    };

    _this.startMutationObserver = function () {
      if (_this._observer) return;
      var dialog = findDOMNode(_this._ref);
      if (!dialog) return; // The focus should always be inside of the modal. We may need to recapture
      // it after an update because the focused element may have been unmounted.

      _this._observer = new MutationObserver(_this.captureFocus);

      _this._observer.observe(dialog, {
        attributes: true,
        childList: true,
        subtree: true
      }); // Disable the mutation observer during blur, as the value of
      // document.activeElement in that phase is misleading.


      addEventListener('blur', _this.stopMutationObserver, {
        capture: true
      });
      addEventListener('focus', _this.startMutationObserver, {
        capture: true
      });
    };

    _this.stopMutationObserver = function () {
      if (_this._observer) {
        _this._observer.disconnect();

        _this._observer = null;
      }

      removeEventListener('blur', _this.stopMutationObserver, {
        capture: true
      });
      removeEventListener('focus', _this.startMutationObserver, {
        capture: true
      });
    };

    _this.captureFocus = function () {
      // If the focus is currently within the page (or null/<body>), focus on this
      // dialog so that tabbing works. We *don't* want to capture focus if the
      // element is in a non-page element, e.g. a popover or other modal.
      var dialog = findDOMNode(_this._ref);
      if (!dialog) return;
      var activeElement = document.activeElement;
      var dialogContainsActiveElement = dialog.contains(activeElement);
      var shouldCapture = false;

      if (!activeElement || activeElement === document.body) {
        shouldCapture = true;
      } else if (!dialogContainsActiveElement) {
        // A few weird apps have multiple .page elements...
        var pages = document.querySelectorAll('body > .page');

        for (var i = 0; i < pages.length; i++) {
          if (pages[i].contains(activeElement)) {
            shouldCapture = true;
            break;
          }
        }
      } // Also, we also want to move focus to the dialog if the focus has somehow
      // wound up on a non-focusable element *within* the dialog.


      if (dialogContainsActiveElement && !matches(activeElement, FOCUSABLE_SELECTOR)) {
        shouldCapture = true;
      }

      if (shouldCapture) {
        dialog.focus();
      }
    };

    _this.refCallback = function (ref) {
      _this._ref = ref;
    };

    _this.handleKeyDown = function (evt) {
      var onEsc = _this.props.onEsc;
      var dialog = findDOMNode(_this._ref);
      if (!dialog) return;

      if (evt.key === 'Tab') {
        // Based on https://www.w3.org/TR/wai-aria-practices/#trap_focus_div
        var activeElement = document.activeElement;
        var allFocusableElements = dialog.querySelectorAll(FOCUSABLE_SELECTOR);
        var firstFocusableElement = first(allFocusableElements);
        var lastFocusableElement = last(allFocusableElements);

        if (evt.shiftKey) {
          // Shift+Tab: If focus is on first element, cycle to last element
          if (activeElement === firstFocusableElement || activeElement === dialog) {
            evt.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          // Unmodified Tab: If focus is on last element, cycle to first element
          if (activeElement === lastFocusableElement || activeElement === dialog) {
            evt.preventDefault();
            firstFocusableElement.focus();
          }
        }
      } else if (evt.key === 'Escape') {
        if (typeof onEsc === 'function') {
          onEsc(evt);
        } else {
          var closeButton = dialog.querySelector('[data-action=close]');
          if (closeButton) closeButton.click();
        }
      }
    };

    _this.headerCallback = function (headerOverflow) {
      if (headerOverflow !== _this.state.headerOverflow) {
        _this.setState({
          headerOverflow: headerOverflow
        });
      }
    };

    _this.state = {
      headerOverflow: 0,
      openComplete: !props._openCompleteRelay
    };
    _this._getContext = memoizeOne(getContext);
    if (props._openCompleteRelay) props._openCompleteRelay.subscribe(_this.handleOpenComplete);
    if (props._closeStartRelay) props._closeStartRelay.subscribe(_this.handleCloseStart);
    return _this;
  }

  _createClass(UIModalDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;
      reportDeprecatedModalMarkup(findDOMNode(this._ref));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      reportDeprecatedModalMarkup(findDOMNode(this._ref));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
      this.stopMutationObserver();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          centered = _this$props.centered,
          children = _this$props.children,
          className = _this$props.className,
          contextual = _this$props.contextual,
          dialogClassName = _this$props.dialogClassName,
          _dialogWidth = _this$props._dialogWidth,
          __onEsc = _this$props.onEsc,
          role = _this$props.role,
          size = _this$props.size,
          use = _this$props.use,
          _use = _this$props._use,
          __closeStartRelay = _this$props._closeStartRelay,
          __openCompleteRelay = _this$props._openCompleteRelay,
          rest = _objectWithoutProperties(_this$props, ["centered", "children", "className", "contextual", "dialogClassName", "_dialogWidth", "onEsc", "role", "size", "use", "_use", "_closeStartRelay", "_openCompleteRelay"]);

      var openComplete = this.state.openComplete;
      var computedUse = _use || use; // If one of the children is <UIDialogCloseButton detached>, render it in
      // the overlay instead of the dialog.

      var closeButton = null;
      var dialogChildren = Children.map(children, function (child) {
        if (child === null) {
          return null;
        } else if (child.type === UIDialogCloseButton && child.props.detached) {
          closeButton = child;
          return null;
        }

        return child;
      });
      var centerContent = ['fullscreen', 'sidebar', 'lightbox'].indexOf(computedUse) === -1;
      return /*#__PURE__*/_jsx(ModalContextProvider, {
        value: this._getContext(use, this.headerCallback),
        children: /*#__PURE__*/_jsxs(UIOverlay, Object.assign({}, rest, {
          centerContent: centerContent,
          className: classNames(className, 'private-modal-dialog--overlay'),
          contextual: contextual,
          "data-component-name": "UIModalDialog",
          "data-open-complete": openComplete,
          onKeyDown: this.handleKeyDown,
          ref: this.refCallback,
          tabIndex: -1,
          children: [/*#__PURE__*/_jsx(UIDialog, {
            _dialogWidth: _dialogWidth,
            centered: centered,
            className: dialogClassName,
            headerOverflow: this.state.headerOverflow,
            role: role !== undefined ? role : 'dialog',
            size: size,
            use: computedUse,
            children: dialogChildren
          }), closeButton]
        }))
      });
    }
  }]);

  return UIModalDialog;
}(Component);

UIModalDialog.propTypes = {
  centered: PropTypes.bool.isRequired,
  children: PropTypes.node,
  contextual: hidden(PropTypes.bool),
  _dialogWidth: UIDialog.propTypes._dialogWidth,
  dialogClassName: PropTypes.string,
  onEsc: PropTypes.func,
  size: PropTypes.oneOf(Object.keys(SIZE_CLASSES)),
  use: PropTypes.oneOf(Object.keys(DIALOG_USE_CLASSES)),
  _use: PropTypes.oneOf(['sidebar']),
  width: UIOverlay.propTypes.width,
  _openCompleteRelay: PropTypes.object,
  _closeStartRelay: PropTypes.object
};
UIModalDialog.contextTypes = {
  sandboxed: PropTypes.bool
};
UIModalDialog.defaultProps = {
  centered: false,
  contextual: false,
  use: 'default',
  size: 'auto',
  width: 450
};
UIModalDialog.displayName = 'UIModalDialog';
export default UIModalDialog;