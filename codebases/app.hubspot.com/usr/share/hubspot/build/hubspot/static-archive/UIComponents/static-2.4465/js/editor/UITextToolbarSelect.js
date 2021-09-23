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
import classNames from 'classnames';
import memoizeOne from 'react-utils/memoizeOne';
import UISelect from '../input/UISelect';
import UISearchInput from '../input/UISearchInput';
import UIDropdownDivider from '../dropdown/UIDropdownDivider';
import { uniqueId } from '../utils/underscore';

var ToolbarSelectSearchInput = function ToolbarSelectSearchInput(props) {
  return /*#__PURE__*/_jsx(UISearchInput, Object.assign({}, props, {
    clearable: false,
    icon: false,
    inputClassName: "private-form__control--small"
  }));
};

var hasGroups = function hasGroups(options) {
  return options[0] && options[0].options;
};

var flattenOptions = function flattenOptions(options) {
  if (!hasGroups(options)) return options;
  var flatOptions = [];
  options.forEach(function (optionGroup, i) {
    optionGroup.options.forEach(function (option) {
      return flatOptions.push(option);
    });
    if (i < options.length - 1) flatOptions.push({
      disabled: true,
      isSpecial: true,
      text: '',
      value: '',
      rawNode: /*#__PURE__*/_jsx(UIDropdownDivider, {
        className: "m-all-0"
      })
    });
  });
  return flatOptions;
};

var UITextToolbarSelect = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITextToolbarSelect, _PureComponent);

  function UITextToolbarSelect(props) {
    var _this;

    _classCallCheck(this, UITextToolbarSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITextToolbarSelect).call(this, props));

    _this.computeButtonStyle = function () {
      // Set the button width based on the widest option text.
      var _this$props = _this.props,
          options = _this$props.options,
          placeholder = _this$props.placeholder;
      var buttonStyle = _this.state.buttonStyle;
      var buttonEl = document.getElementById(_this._id);
      if (!buttonEl) return;
      var originalButtonElWidthStyle = buttonEl.style.width;
      buttonEl.style.width = '';
      var textEl = buttonEl.querySelector('[data-option-text]');
      var originalTextElContents = textEl.innerHTML;
      var maxButtonWidth = 0;

      if (placeholder) {
        textEl.textContent = placeholder;
        maxButtonWidth = buttonEl.offsetWidth;
      }

      var flatOptions = _this._flattenOptions(options);

      flatOptions.forEach(function (option) {
        textEl.textContent = option.text;
        var measuredOptionWidth = buttonEl.offsetWidth;
        maxButtonWidth = Math.max(maxButtonWidth, measuredOptionWidth);
      });
      maxButtonWidth = Math.ceil(maxButtonWidth + 1);

      if (maxButtonWidth === 0) {
        _this.setState({
          buttonStyle: null
        });
      } else if (!buttonStyle || buttonStyle.width !== maxButtonWidth) {
        _this.setState({
          buttonStyle: {
            width: maxButtonWidth
          }
        });
      }

      buttonEl.style.width = originalButtonElWidthStyle;
      textEl.innerHTML = originalTextElContents;
    };

    _this.state = {
      buttonStyle: null
    };
    _this._id = uniqueId('text-toolbar-select-');
    _this._flattenOptions = memoizeOne(flattenOptions);
    return _this;
  }

  _createClass(UITextToolbarSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.computeButtonStyle();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevProps.options !== this.props.options) {
        this.computeButtonStyle();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          options = _this$props2.options,
          showSearchbox = _this$props2.showSearchbox,
          use = _this$props2.use,
          rest = _objectWithoutProperties(_this$props2, ["className", "options", "showSearchbox", "use"]);

      var buttonStyle = this.state.buttonStyle;

      var flatOptions = this._flattenOptions(options);

      return /*#__PURE__*/_jsx(UISelect, Object.assign({
        buttonSize: "sm",
        buttonStyle: buttonStyle,
        buttonUse: use === 'on-dark' ? 'tertiary-extra-light' : 'tertiary-light',
        className: classNames('private-button--toolbar', className),
        id: this._id,
        minimumSearchCount: showSearchbox ? 0 : Infinity,
        options: flatOptions,
        resultsClassName: "private-typeahead-results--toolbar",
        searchClassName: "private-search-control__wrapper--toolbar",
        SearchInput: ToolbarSelectSearchInput
      }, rest));
    }
  }]);

  return UITextToolbarSelect;
}(PureComponent);

UITextToolbarSelect.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: UISelect.propTypes.options.isRequired,
  placeholder: PropTypes.string,
  showSearchbox: PropTypes.bool.isRequired,
  use: PropTypes.oneOf(['', 'on-dark']).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
UITextToolbarSelect.defaultProps = {
  showSearchbox: false,
  use: ''
};
UITextToolbarSelect.displayName = 'UITextToolbarSelect';
export default UITextToolbarSelect;