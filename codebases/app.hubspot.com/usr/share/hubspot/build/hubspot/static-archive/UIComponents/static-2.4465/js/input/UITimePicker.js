'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import devLogger from 'react-utils/devLogger';
import Controllable from '../decorators/Controllable';
import UISelect from '../input/UISelect';
import virtualizedMenuRenderer from '../input/utils/virtualizedMenuRenderer';
import UITypeaheadResultsItem from '../typeahead/results/UITypeaheadResultsItem';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import deprecated from '../utils/propTypes/deprecated';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
var MINUTES_IN_A_DAY = 24 * 60;
var NUMBER_REGEX = /\d/;

var condense = function condense(str) {
  return str.replace(/\s/g, '').toLowerCase();
};

var formatTime = function formatTime(format, value) {
  return I18n.moment.utc(0).minutes(value).format(format);
};

var generateOptions = function generateOptions(extraTimes, format, interval, max, min, normalizedValue) {
  var options = [];
  var computedMin = typeof min === 'number' ? min : 0;
  var computedMax = typeof max === 'number' ? max : MINUTES_IN_A_DAY;

  for (var value = 0; value < MINUTES_IN_A_DAY; value += interval) {
    var outOfRange = computedMin > value || value > computedMax;

    if (outOfRange) {
      continue;
    }

    var text = formatTime(format, value);
    options.push({
      text: text,
      value: value
    });

    if (normalizedValue && normalizedValue > value && normalizedValue < value + interval) {
      var normalizedValueText = I18n.moment.utc(0).minutes(normalizedValue).format(format);
      options.push({
        text: normalizedValueText,
        value: normalizedValue
      });
    }
  }

  extraTimes.forEach(function (value) {
    if (!options.some(function (option) {
      return option.value === value;
    })) {
      var _text = formatTime(format, value);

      options.push({
        text: _text,
        value: value
      });
    }
  });
  return options;
};

var normalizeValue = function normalizeValue(format, value) {
  // Return a string corresponding to the number of minutes into the day
  // represented by the value.
  if (value == null) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  devLogger.warn({
    message: "UITimePicker: String value \"" + value + "\" given. This can cause inconsistent behavior.",
    key: 'UITimePicker: string value'
  });
  var moment = I18n.moment.utc(value, format);
  return moment.hours() * 60 + moment.minutes();
};

var optionMatchesSearch = function optionMatchesSearch(option, search) {
  if (!search) {
    return true;
  } // Ignore whitespace and casing


  var condensedSearch = condense(search);
  var condensedOptionText = condense(option.text); // Match front-to-back, allowing chars to be skipped (except the first
  // number). So e.g. a search for "8" matches all times of the form "8:xx",
  // and a search for "815" matches "8:15 AM" and "8:15 PM".

  var searchRegexMatch = condensedSearch.match(NUMBER_REGEX);

  if (searchRegexMatch && searchRegexMatch[0] !== option.text.match(NUMBER_REGEX)[0]) {
    return false;
  }

  var lastSearchCharMatchPos = -1;

  for (var i = 0; i < condensedSearch.length; i++) {
    var searchCharMatchPos = condensedOptionText.indexOf(condensedSearch[i], lastSearchCharMatchPos + 1);

    if (searchCharMatchPos === -1) {
      return false;
    }

    lastSearchCharMatchPos = searchCharMatchPos;
  }

  return true;
};

var getSearchResults = function getSearchResults(options, search) {
  var filteredOptions = options.filter(function (option) {
    return optionMatchesSearch(option, search);
  });
  var exactMatches = [];
  var otherMatches = [];
  filteredOptions.forEach(function (option) {
    if (condense(option.text).startsWith(condense(search))) {
      exactMatches.push(option);
    } else {
      otherMatches.push(option);
    }
  });
  return [].concat(exactMatches, otherMatches);
};

var deprecatedMinMaxMessage = function deprecatedMinMaxMessage(propName) {
  var newPropName = propName.replace('Value', '');
  return {
    message: "UITimePicker: The `" + propName + "` prop is deprecated. Use `" + newPropName + "` instead.",
    key: 'UITimePicker-old-minmax'
  };
};

var valueRenderer = function valueRenderer(option) {
  return /*#__PURE__*/_jsx(UITypeaheadResultsItem, {
    "aria-invalid": option.invalid,
    itemComponent: "span",
    option: Object.assign({}, option, {
      icon: 'time'
    }),
    _useButton: false,
    _useDropdownText: false
  });
};

var getButtonSize = function getButtonSize(shorthandSize, use) {
  if (shorthandSize === 'sm' && use === 'on-dark') {
    return 'sm';
  }

  return 'default';
};

var getButtonUse = function getButtonUse(shorthandSize, use) {
  if (use === 'on-dark') {
    return shorthandSize === 'sm' ? 'tertiary-extra-light' : 'form-on-dark';
  }

  return shorthandSize === 'sm' ? 'link' : 'form';
};

var getMenuWidth = function getMenuWidth(menuWidth, shorthandSize) {
  if (menuWidth) {
    return menuWidth;
  }

  if (shorthandSize === 'sm') {
    return 300;
  }

  return undefined;
};

var UITimePicker = /*#__PURE__*/function (_Component) {
  _inherits(UITimePicker, _Component);

  function UITimePicker() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UITimePicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UITimePicker)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      options: null
    };

    _this.focus = function () {
      if (_this._timeInputRef) {
        _this._timeInputRef.focus();
      }
    };

    return _this;
  }

  _createClass(UITimePicker, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var _this$props = this.props,
          extraTimes = _this$props.extraTimes,
          format = _this$props.format,
          interval = _this$props.interval,
          max = _this$props.max,
          maxValue = _this$props.maxValue,
          min = _this$props.min,
          minValue = _this$props.minValue,
          value = _this$props.value;
      var normalizedValue = normalizeValue(format, value);
      this.setState({
        options: generateOptions(extraTimes, format, interval, max || maxValue, min || minValue, normalizedValue)
      });
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var extraTimes = nextProps.extraTimes,
          format = nextProps.format,
          interval = nextProps.interval,
          max = nextProps.max,
          maxValue = nextProps.maxValue,
          min = nextProps.min,
          minValue = nextProps.minValue,
          value = nextProps.value;

      if (extraTimes !== this.props.extraTimes || format !== this.props.format || interval !== this.props.interval || max !== this.props.max || maxValue !== this.props.maxValue || min !== this.props.min || minValue !== this.props.minValue || value !== this.props.value) {
        var normalizedValue = normalizeValue(format, value);
        this.setState({
          options: generateOptions(extraTimes, format, interval, max || maxValue, min || minValue, normalizedValue)
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          className = _this$props2.className,
          format = _this$props2.format,
          __interval = _this$props2.interval,
          menuWidth = _this$props2.menuWidth,
          size = _this$props2.size,
          use = _this$props2.use,
          value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["className", "format", "interval", "menuWidth", "size", "use", "value"]);

      var shorthandSize = toShorthandSize(size);
      var buttonSize = getButtonSize(shorthandSize, use);
      var buttonUse = getButtonUse(shorthandSize, use);
      var computedMenuWidth = getMenuWidth(menuWidth, shorthandSize);
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, rest, {
        buttonSize: buttonSize,
        buttonUse: buttonUse,
        className: classNames('private-timepicker', className),
        filterOptions: getSearchResults,
        matchPos: "start",
        matchProp: "label",
        menuRenderer: virtualizedMenuRenderer,
        menuWidth: computedMenuWidth,
        options: this.state.options,
        ref: function ref(elt) {
          _this2._timeInputRef = elt;
        },
        resetValue: null,
        value: normalizeValue(format, value),
        valueRenderer: valueRenderer
      }));
    }
  }]);

  return UITimePicker;
}(Component);

UITimePicker.propTypes = {
  clearable: PropTypes.bool.isRequired,
  extraTimes: PropTypes.arrayOf(PropTypes.number).isRequired,
  format: PropTypes.string.isRequired,
  interval: PropTypes.number.isRequired,
  max: PropTypes.number,
  maxValue: deprecated(PropTypes.number, deprecatedMinMaxMessage),
  menuWidth: UISelect.propTypes.menuWidth,
  min: PropTypes.number,
  minValue: deprecated(PropTypes.number, deprecatedMinMaxMessage),
  onChange: PropTypes.func,
  placeholder: createLazyPropType(PropTypes.node).isRequired,
  size: PropTypes.oneOfType([propTypeForSizes(['sm']), PropTypes.oneOf(['default'])]).isRequired,
  use: PropTypes.oneOf(['default', 'on-dark']).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
UITimePicker.defaultProps = {
  clearable: true,
  extraTimes: [],
  format: 'LT',
  interval: 30,
  placeholder: function placeholder() {
    return I18n.text('salesUI.UITimePicker.placeholder');
  },
  size: 'default',
  use: 'default'
};
UITimePicker.displayName = 'UITimePicker';
export default Controllable(UITimePicker);