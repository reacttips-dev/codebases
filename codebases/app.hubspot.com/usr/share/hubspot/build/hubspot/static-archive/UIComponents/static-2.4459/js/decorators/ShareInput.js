'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import devLogger from 'react-utils/devLogger';
import getComponentName from 'react-utils/getComponentName';
import { attachWrappedComponent, copyMethods, isFunctionalComponent } from './utils';
import refObject from '../utils/propTypes/refObject';
import { stopPropagationHandler } from '../utils/DomEvents';
var hasPingedNewRelic = false;

var reportDeprecatedMethod = function reportDeprecatedMethod(componentName, methodName) {
  if (process.env.NODE_ENV !== 'production') {
    devLogger.warn({
      message: componentName + ": Calling `" + methodName + "` on a ref to an input component is deprecated. " + "Use `inputRef` to get a direct reference to the <input> or <textarea> instead.",
      key: "ShareInput-" + methodName
    });
  }

  if (window.newrelic && !hasPingedNewRelic) {
    window.newrelic.addPageAction('share-hoc-method', {
      hoc: 'ShareInput',
      componentName: componentName,
      methodName: methodName
    });
    hasPingedNewRelic = true;
  }
};

var getInputRef = function getInputRef(component) {
  return component.props.inputRef || component._defaultInputRef;
};

export default function (Component) {
  var ShareInputDecorator = /*#__PURE__*/function (_React$Component) {
    _inherits(ShareInputDecorator, _React$Component);

    function ShareInputDecorator() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ShareInputDecorator);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ShareInputDecorator)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _this.focus = function () {
        if (_this._ref && typeof _this._ref.focus === 'function') {
          _this._ref.focus();

          return;
        }

        reportDeprecatedMethod(_this.constructor.CoreComponent.displayName, 'focus');
        var inputRef = _this.props.inputRef || _this._defaultInputRef;

        if (inputRef.current && typeof inputRef.current.focus === 'function') {
          inputRef.current.focus();
        }
      };

      _this.select = function () {
        if (_this._ref && typeof _this._ref.select === 'function') {
          _this._ref.select();

          return;
        }

        reportDeprecatedMethod(_this.constructor.CoreComponent.displayName, 'select');
        var inputRef = _this.props.inputRef || _this._defaultInputRef;

        if (inputRef.current && typeof inputRef.current.select === 'function') {
          inputRef.current.select();
        }
      };

      _this.refCallback = function (ref) {
        if (isFunctionalComponent(Component)) return;
        _this._ref = ref;
        if (ref) copyMethods(ref, _assertThisInitialized(_this));
      };

      _this.handleCompositionStart = function (evt) {
        var onCompositionStart = _this.props.onCompositionStart; // Prevent keyup/keydown while IME composition is in progress

        var inputEl = getInputRef(_assertThisInitialized(_this)).current;
        inputEl.addEventListener('keyup', stopPropagationHandler);
        inputEl.addEventListener('keydown', stopPropagationHandler);
        if (onCompositionStart) onCompositionStart(evt);
      };

      _this.handleCompositionEnd = function (evt) {
        var onCompositionEnd = _this.props.onCompositionEnd; // Resume allowing keyup/keydown events

        var inputEl = getInputRef(_assertThisInitialized(_this)).current;
        inputEl.removeEventListener('keyup', stopPropagationHandler);
        inputEl.removeEventListener('keydown', stopPropagationHandler);
        if (onCompositionEnd) onCompositionEnd(evt);
      };

      _this._defaultInputRef = /*#__PURE__*/React.createRef();
      return _this;
    }

    _createClass(ShareInputDecorator, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {
          onCompositionStart: this.handleCompositionStart,
          onCompositionEnd: this.handleCompositionEnd,
          inputRef: getInputRef(this),
          ref: this.refCallback
        }));
      }
    }]);

    return ShareInputDecorator;
  }(React.Component);

  var componentName = getComponentName(Component);
  ShareInputDecorator.displayName = "ShareInput(" + componentName + ")";
  ShareInputDecorator.propTypes = Object.assign({}, Component.propTypes, {
    inputRef: refObject
  });
  ShareInputDecorator.defaultProps = Component.defaultProps;
  attachWrappedComponent(ShareInputDecorator, Component);
  return ShareInputDecorator;
}