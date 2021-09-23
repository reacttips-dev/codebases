'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import GreaterRolling from 'customer-data-filters/filterQueryFormat/operator/GreaterRolling';
import I18n from 'I18n';
import LessRolling from 'customer-data-filters/filterQueryFormat/operator/LessRolling';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIInputGroup from 'UIComponents/form/UIInputGroup';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UISelect from 'UIComponents/input/UISelect';
import isNumber from 'transmute/isNumber';

var FilterOperatorRollingInequalityInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterOperatorRollingInequalityInput, _PureComponent);

  function FilterOperatorRollingInequalityInput(props) {
    var _this;

    _classCallCheck(this, FilterOperatorRollingInequalityInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorRollingInequalityInput).call(this, props));

    _this.handleChangeDirection = function (_ref) {
      var direction = _ref.target.value;
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          value = _this$props.value;
      onChange(SyntheticEvent(value.set('direction', direction)));
    };

    _this.handleChangeNumberOfDays = function (_ref2) {
      var days = _ref2.target.value;
      var _this$props2 = _this.props,
          onChange = _this$props2.onChange,
          value = _this$props2.value;

      _this.setState({
        error: false
      });

      onChange(SyntheticEvent(value.set('numberOfDays', days)));
    };

    _this.handleCommit = function (value) {
      if (!isNumber(value)) {
        _this.setState({
          error: true
        });
      }

      return value ? "" + value : null;
    };

    _this.state = {
      error: false
    };
    return _this;
  }

  _createClass(FilterOperatorRollingInequalityInput, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          value = _this$props3.value;
      var error = this.state.error;
      var options = [{
        text: I18n.text('customerDataFilters.FilterOperatorRollingInequalityInput.daysAgo', {
          count: value.numberOfDays || 0
        }),
        value: 'backward'
      }, {
        text: I18n.text('customerDataFilters.FilterOperatorRollingInequalityInput.daysFromNow', {
          count: value.numberOfDays || 0
        }),
        value: 'forward'
      }];
      return /*#__PURE__*/_jsxs(UIInputGroup, {
        className: className,
        use: "itemRight",
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          error: error,
          validationMessage: error ? /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorRollingInequalityInput.error"
          }) : null,
          children: /*#__PURE__*/_jsx(UINumberInput, {
            defaultValue: 1,
            formatter: this.handleCommit,
            onChange: this.handleChangeNumberOfDays,
            value: value.numberOfDays
          })
        }), /*#__PURE__*/_jsx("div", {
          children: /*#__PURE__*/_jsx(UISelect, {
            buttonUse: "transparent",
            onChange: this.handleChangeDirection,
            options: options,
            value: value.direction
          })
        })]
      });
    }
  }]);

  return FilterOperatorRollingInequalityInput;
}(PureComponent);

FilterOperatorRollingInequalityInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.instanceOf(GreaterRolling).isRequired, PropTypes.instanceOf(LessRolling).isRequired]).isRequired
};
export default FilterOperatorRollingInequalityInput;