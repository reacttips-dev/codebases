'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
var propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
var noValueToken = 'NO_VALUE';

var PropertyInputPersona = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputPersona, _Component);

  function PropertyInputPersona() {
    var _this;

    _classCallCheck(this, PropertyInputPersona);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputPersona).call(this));

    _this.handleChange = function (evt) {
      var value = evt.target.value;
      var nextValue = value === noValueToken ? '' : "" + value;
      return _this.props.onChange({
        target: {
          value: nextValue
        }
      });
    };

    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this._input = null;
    return _this;
  }

  _createClass(PropertyInputPersona, [{
    key: "focus",
    value: function focus(evt) {
      this._input.focus(evt);
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var noValue = I18n.text('customerDataProperties.PersonaSearchableSelectInput.noPersona');
      var blankValueOption = PropertyOptionRecord({
        label: noValue,
        value: noValueToken
      });
      return List.of(blankValueOption);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          rest = _objectWithoutProperties(_this$props, ["className"]);

      var value = this.props.value ? this.props.value.toString() : undefined;
      return /*#__PURE__*/_jsx(ReferenceInputEnum, Object.assign({}, rest, {
        className: classNames('PropertyInputPersona', className),
        onChange: this.handleChange,
        options: this.getOptions(),
        ref: function ref(input) {
          _this2._input = input;
        },
        value: value
      }));
    }
  }]);

  return PropertyInputPersona;
}(Component);

export { PropertyInputPersona as default };
PropertyInputPersona.propTypes = propTypes;