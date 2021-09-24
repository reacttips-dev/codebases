'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIClickable from '../button/UIClickable';
import { FieldsetContextConsumer } from '../context/FieldsetContext';
import { callIfPossible } from '../core/Functions';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import UIIcon from '../icon/UIIcon';
import UITextInput from '../input/UITextInput';
import UITooltip from '../tooltip/UITooltip';
import lazyEval from '../utils/lazyEval';
import { getTextWidth } from '../utils/MeasureText';
import { hidden } from '../utils/propTypes/decorators';
import deprecated from '../utils/propTypes/deprecated';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';

var getMinimumSearchMessage = function getMinimumSearchMessage(minimumSearchCount, value, getValidationMessage) {
  //This is deprecating minimumSearchCount, so if an getValidationMessage is present it will ignore minimumSearchCount
  if (getValidationMessage) {
    return getValidationMessage(value);
  }

  var valueLength = value ? value.length : 0;
  var charsNeeded = minimumSearchCount - valueLength;

  if (valueLength && charsNeeded > 0) {
    return I18n.text('salesUI.UISearchInput.minimumSearchMessage', {
      count: charsNeeded
    });
  }

  return null;
};

var UISearchInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(UISearchInput, _PureComponent);

  function UISearchInput(props) {
    var _this;

    _classCallCheck(this, UISearchInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UISearchInput).call(this, props));

    _this.handleKeyDown = function (evt) {
      var _this$props = _this.props,
          onKeyDown = _this$props.onKeyDown,
          readOnly = _this$props.readOnly;
      if (readOnly) return;

      if (evt.key === 'Escape') {
        _this.triggerClear();
      }

      callIfPossible(onKeyDown, evt);
    };

    _this.triggerClear = function () {
      var _this$props2 = _this.props,
          inputRef = _this$props2.inputRef,
          onChange = _this$props2.onChange;
      onChange(SyntheticEvent(''));
      inputRef.current.focus();
    };

    _this.state = {
      minimumSearchMessageOverflows: false
    };
    return _this;
  }

  _createClass(UISearchInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props3 = this.props,
          getValidationMessage = _this$props3.getValidationMessage,
          minimumSearchCount = _this$props3.minimumSearchCount;
      if (getValidationMessage || minimumSearchCount > 0) this.computeMinimumSearchMessageOverflow();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props4 = this.props,
          getValidationMessage = _this$props4.getValidationMessage,
          minimumSearchCount = _this$props4.minimumSearchCount;
      if (getValidationMessage || minimumSearchCount > 0) this.computeMinimumSearchMessageOverflow();
    }
  }, {
    key: "computeMinimumSearchMessageOverflow",
    value: function computeMinimumSearchMessageOverflow() {
      // Determine whether there's enough space to show the minimum search message inline (#2869)
      var inputRef = this.props.inputRef;
      if (!this._wrapperEl || !this._iconEl || !this._helpTextEl) return;
      var wrapperWidth = this._wrapperEl.offsetWidth - this._iconEl.offsetWidth;
      var searchMessageWidth = this._helpTextEl.offsetWidth;
      var textWidth = getTextWidth(inputRef.current);
      var minimumSearchMessageOverflows = searchMessageWidth > wrapperWidth - textWidth;

      if (minimumSearchMessageOverflows !== this.state.minimumSearchMessageOverflows) {
        this.setState({
          minimumSearchMessageOverflows: minimumSearchMessageOverflows
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props5 = this.props,
          className = _this$props5.className,
          clearable = _this$props5.clearable,
          icon = _this$props5.icon,
          inputClassName = _this$props5.inputClassName,
          getValidationMessage = _this$props5.getValidationMessage,
          minimumSearchCount = _this$props5.minimumSearchCount,
          placeholder = _this$props5.placeholder,
          readOnly = _this$props5.readOnly,
          size = _this$props5.size,
          value = _this$props5.value,
          rest = _objectWithoutProperties(_this$props5, ["className", "clearable", "icon", "inputClassName", "getValidationMessage", "minimumSearchCount", "placeholder", "readOnly", "size", "value"]);

      var minimumSearchMessageOverflows = this.state.minimumSearchMessageOverflows;
      return /*#__PURE__*/_jsx(FieldsetContextConsumer, {
        children: function children(fieldsetContext) {
          var shorthandSize = toShorthandSize(size);
          var computedClassName = classNames('private-search-control', className, shorthandSize === 'xl' && 'private-search-control--xl');
          var showClearButton = clearable && value && !readOnly;
          var minimumSearchMessage = getMinimumSearchMessage(minimumSearchCount, value, getValidationMessage);
          var renderedMinimumSearchMessage = minimumSearchMessage ? /*#__PURE__*/_jsx("span", {
            "aria-atomic": false,
            "aria-live": "polite",
            className: 'private-search-control__help-text' + (minimumSearchMessageOverflows ? " private-search-control__help-text--hidden" : ""),
            ref: function ref(_ref) {
              _this2._helpTextEl = _ref;
            },
            children: minimumSearchMessage
          }) : null;
          var renderedSearchIcon = icon && !readOnly ? /*#__PURE__*/_jsx("span", {
            ref: function ref(_ref2) {
              _this2._iconEl = _ref2;
            },
            children: /*#__PURE__*/_jsx(UIIcon, {
              className: classNames('private-search-control__icon', showClearButton && 'private-search-control__icon--hidden', fieldsetContext.size === 'small' && 'private-search-control__icon--small'),
              name: "search"
            })
          }) : null;
          var renderedClearButton = showClearButton ? /*#__PURE__*/_jsx(UIClickable, {
            className: 'private-search-control__clear-button' + (fieldsetContext.size === 'small' ? " private-search-control__clear-button--small" : ""),
            onClick: _this2.triggerClear,
            tabIndex: -1,
            children: /*#__PURE__*/_jsx(UIIcon, {
              name: "remove"
            })
          }) : null;
          return /*#__PURE__*/_jsx(UITooltip, {
            open: !!(minimumSearchMessage && minimumSearchMessageOverflows),
            title: minimumSearchMessage,
            children: /*#__PURE__*/_jsxs("div", {
              className: computedClassName,
              ref: function ref(_ref3) {
                _this2._wrapperEl = _ref3;
              },
              children: [/*#__PURE__*/_jsx(UITextInput, Object.assign({}, rest, {
                className: classNames('private-search-control__input', inputClassName),
                onKeyDown: _this2.handleKeyDown,
                placeholder: lazyEval(placeholder),
                readOnly: readOnly,
                value: value
              })), /*#__PURE__*/_jsxs("span", {
                className: "private-search-control__foreground",
                children: [renderedMinimumSearchMessage, renderedSearchIcon]
              }), renderedClearButton]
            })
          });
        }
      });
    }
  }]);

  return UISearchInput;
}(PureComponent);

UISearchInput.propTypes = Object.assign({}, UITextInput.propTypes, {
  clearable: PropTypes.bool.isRequired,
  icon: PropTypes.bool.isRequired,
  inputClassName: PropTypes.string,
  getValidationMessage: PropTypes.func,
  minimumSearchCount: deprecated(PropTypes.number, {
    message: "UISearchInput: The `minimumSearchCount` prop is deprecated. Use `getValidationMessage` instead.",
    key: 'UISearchInput-minimumSearchCount'
  }, 0),
  size: PropTypes.oneOfType([propTypeForSizes(['xl']), PropTypes.oneOf(['default'])]).isRequired,
  type: hidden(UITextInput.propTypes.type)
});
UISearchInput.defaultProps = Object.assign({}, UITextInput.defaultProps, {
  clearable: true,
  icon: true,
  getValidationMessage: null,
  minimumSearchCount: 0,
  placeholder: function placeholder() {
    return I18n.text('salesUI.UISearchInput.placeholder');
  },
  size: 'default',
  type: 'search',
  value: ''
});
UISearchInput.displayName = 'UISearchInput';
export default ShareInput(Controllable(UISearchInput));