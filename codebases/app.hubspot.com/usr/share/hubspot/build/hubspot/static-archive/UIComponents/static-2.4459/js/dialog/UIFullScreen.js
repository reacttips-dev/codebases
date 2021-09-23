'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { cloneElement, Children, Component } from 'react';
import UILayer from '../layer/UILayer';
import { isPageInKeyboardMode } from '../listeners/focusStylesListener';
import { warnIfFragment } from '../utils/devWarnings'; // Based on https://github.com/twbs/bootstrap/blob/v3.3.6/dist/js/bootstrap.js

function measureScrollbar() {
  var scrollDiv = document.createElement('div');
  scrollDiv.className = 'uiFullScreen-scrollbar-measure';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

var UIFullScreen = /*#__PURE__*/function (_Component) {
  _inherits(UIFullScreen, _Component);

  function UIFullScreen(props) {
    var _this;

    _classCallCheck(this, UIFullScreen);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIFullScreen).call(this, props));

    _this.handleCloseComplete = function () {
      if (_this._lastFocus) {
        if (isPageInKeyboardMode()) {
          _this._lastFocus.focus();
        }

        _this._lastFocus = null;
      }

      if (_this.constructor.layerCount === 0) {
        _this.restoreBackgroundScrolling();
      }
    };

    _this._lastFocus = document.activeElement;
    return _this;
  }

  _createClass(UIFullScreen, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.constructor.layerCount += 1;

      if (this.constructor.layerCount === 1) {
        this.disableBackgroundScrolling();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.constructor.layerCount -= 1;
    }
  }, {
    key: "disableBackgroundScrolling",
    value: function disableBackgroundScrolling() {
      var _this2 = this;

      this.addFauxScrollbar();
      [document.documentElement, document.body].forEach(function (el) {
        return el.classList && el.classList.add(_this2.constructor.NO_SCROLL_CLASS);
      });
    }
  }, {
    key: "restoreBackgroundScrolling",
    value: function restoreBackgroundScrolling() {
      var _this3 = this;

      this.removeFauxScrollbar();
      [document.documentElement, document.body].forEach(function (el) {
        return el.classList && el.classList.remove(_this3.constructor.NO_SCROLL_CLASS);
      });
    }
  }, {
    key: "addFauxScrollbar",
    value: function addFauxScrollbar() {
      var bodyHasScrollbar = document.body.clientWidth < window.innerWidth;

      if (bodyHasScrollbar) {
        var scrollbarWidth = measureScrollbar() + "px"; // To avoid changing the body width when we disable scrollbar, we replace
        // the scrollbar with padding of equal width.

        this.constructor.originalBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = scrollbarWidth;
      }
    }
  }, {
    key: "removeFauxScrollbar",
    value: function removeFauxScrollbar() {
      document.body.style.paddingRight = this.constructor.originalBodyPaddingRight;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          rest = _objectWithoutProperties(_this$props, ["children"]);

      warnIfFragment(children, UIFullScreen.displayName);
      return /*#__PURE__*/_jsx(UILayer, Object.assign({}, rest, {
        onCloseComplete: this.handleCloseComplete,
        children: /*#__PURE__*/cloneElement(Children.only(children), {
          open: true
        })
      }));
    }
  }]);

  return UIFullScreen;
}(Component);

UIFullScreen.layerCount = 0;
UIFullScreen.NO_SCROLL_CLASS = 'uiFullScreenBackground';
UIFullScreen.originalBodyPaddingRight = '';
export { UIFullScreen as default };
UIFullScreen.propTypes = {
  children: PropTypes.element.isRequired,
  rootNode: UILayer.propTypes.rootNode,
  Transition: PropTypes.elementType
};
UIFullScreen.displayName = 'UIFullScreen';