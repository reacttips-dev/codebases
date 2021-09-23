'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";

var _temp;

import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import partial from 'react-utils/partial';
import memoizeOne from 'react-utils/memoizeOne';
import SyntheticEvent from '../../core/SyntheticEvent';
import HoverProvider from '../../providers/HoverProvider';
import UITypeaheadResults from '../../typeahead/results/UITypeaheadResults';
import UITypeaheadResultsItem from '../../typeahead/results/UITypeaheadResultsItem';
import range from '../../utils/underscore/range';
export function parseValue(format, rawValue) {
  if (rawValue == null || rawValue === '') {
    return undefined;
  }

  var moment = I18n.moment.utc(rawValue, format);
  return moment.hours() * 60 + moment.minutes();
}
export function formatValue(format, value) {
  if (value == null) {
    return '';
  }

  return I18n.moment.utc(0).minutes(value).format(format);
}

var getOptionForValue = function getOptionForValue(value, valueFormatter) {
  return {
    text: valueFormatter ? valueFormatter(value) : value,
    value: value
  };
};

export var PrivateTimePickerOption = (_temp = /*#__PURE__*/function (_Component) {
  _inherits(PrivateTimePickerOption, _Component);

  function PrivateTimePickerOption(props) {
    var _this;

    _classCallCheck(this, PrivateTimePickerOption);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PrivateTimePickerOption).call(this, props));

    _this.scrollIntoView = function () {
      var el = findDOMNode(_this._ref);

      if (el == null) {
        return;
      }

      var offsetHeight = el.offsetHeight,
          offsetParent = el.offsetParent,
          offsetTop = el.offsetTop;
      offsetParent.scrollTop = offsetTop - (offsetParent.offsetHeight - offsetHeight) / 2;
    };

    _this.refCallback = function (ref) {
      _this._ref = ref;
    };

    _this._getOption = memoizeOne(getOptionForValue);
    return _this;
  }

  _createClass(PrivateTimePickerOption, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.highlighted) {
        this.scrollIntoView();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var highlighted = this.props.highlighted;

      if (!this._hovered && highlighted && !prevProps.highlighted) {
        this.scrollIntoView();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          value = _this$props.value,
          valueFormatter = _this$props.valueFormatter,
          rest = _objectWithoutProperties(_this$props, ["value", "valueFormatter"]);

      var option = this._getOption(value, valueFormatter);

      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          var hovered = hoverProviderProps.hovered,
              hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

          _this2._hovered = hovered;
          return /*#__PURE__*/_jsx(UITypeaheadResultsItem, Object.assign({}, rest, {}, hoverProviderRestProps, {
            ref: _this2.refCallback,
            option: option
          }));
        }
      }));
    }
  }]);

  return PrivateTimePickerOption;
}(Component), _temp);
export var PrivateTimePickerOptions = /*#__PURE__*/function (_PureComponent) {
  _inherits(PrivateTimePickerOptions, _PureComponent);

  function PrivateTimePickerOptions() {
    _classCallCheck(this, PrivateTimePickerOptions);

    return _possibleConstructorReturn(this, _getPrototypeOf(PrivateTimePickerOptions).apply(this, arguments));
  }

  _createClass(PrivateTimePickerOptions, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          focusedValue = _this$props2.focusedValue,
          valueFormatter = _this$props2.valueFormatter,
          interval = _this$props2.interval,
          makeOptionId = _this$props2.makeOptionId,
          max = _this$props2.max,
          min = _this$props2.min,
          onOptionClick = _this$props2.onOptionClick,
          onOptionHover = _this$props2.onOptionHover; // Use the closest interval multiple as the min/max in the dropdown (see #7688)

      var computedMin = Math.ceil(min / interval) * interval;
      var computedMax = (Math.floor(max / interval) + 1) * interval;
      return /*#__PURE__*/_jsx(UITypeaheadResults, {
        children: range(computedMin, computedMax, interval).map(function (value) {
          return /*#__PURE__*/_jsx(PrivateTimePickerOption, {
            id: makeOptionId(value),
            valueFormatter: valueFormatter,
            highlighted: value === focusedValue,
            value: value,
            onMouseDown: function onMouseDown(evt) {
              /* This handler is passed as onMouseDown instead of onClick so that it fires before
              the parent component's input's `blur` event */
              onOptionClick(SyntheticEvent(value, evt));
            },
            onMouseEnter: partial(onOptionHover, value)
          }, value);
        })
      });
    }
  }]);

  return PrivateTimePickerOptions;
}(PureComponent);
PrivateTimePickerOptions.propTypes = {
  focusedValue: PropTypes.number,
  valueFormatter: PropTypes.func,
  interval: PropTypes.number,
  makeOptionId: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  onOptionHover: PropTypes.func.isRequired,
  onOptionClick: PropTypes.func
};