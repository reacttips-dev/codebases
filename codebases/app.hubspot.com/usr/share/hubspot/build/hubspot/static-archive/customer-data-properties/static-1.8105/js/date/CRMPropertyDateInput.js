'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import { MomentTypes } from 'customer-data-properties/date/MomentTypes';
import * as SimpleDate from 'UIComponents/core/SimpleDate';
import UIDateInput from 'UIComponents/dates/UIDateInput';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import omit from 'transmute/omit';
import { Seq } from 'immutable';
import I18n from 'I18n';
import emptyFunction from 'react-utils/emptyFunction';
import classNames from 'classnames';

function toTimestamp(momentType, type, simpleDate) {
  if (!simpleDate) {
    return null;
  }

  if (type === 'date') {
    return SimpleDate.toMomentUTC(simpleDate).valueOf();
  } else {
    var result;

    if (momentType === MomentTypes.PORTAL) {
      result = SimpleDate.toMomentPortalTz(simpleDate);
    } else {
      result = SimpleDate.toMoment(simpleDate);
    }

    if (type === 'endOfDay') {
      result = result.endOf('day');
    }

    return result.valueOf();
  }
}

var propTypes = {
  className: PropTypes.string,
  momentType: PropTypes.string.isRequired,
  type: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
var defaultProps = {
  momentType: MomentTypes.USER,
  onChange: emptyFunction
};

var CRMPropertyDateInput = /*#__PURE__*/function (_Component) {
  _inherits(CRMPropertyDateInput, _Component);

  function CRMPropertyDateInput() {
    var _this;

    _classCallCheck(this, CRMPropertyDateInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CRMPropertyDateInput).call(this));

    _this.handleChange = function (evt) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          momentType = _this$props.momentType,
          type = _this$props.type;
      var timestamp = toTimestamp(momentType, type, evt.target.value);

      if (isNaN(timestamp)) {
        return;
      }

      onChange(SyntheticEvent(timestamp));
    };

    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(CRMPropertyDateInput, [{
    key: "focus",
    value: function focus() {
      this.inputRef.current.focus();
    }
  }, {
    key: "getMoment",
    value: function getMoment() {
      var _this$props2 = this.props,
          momentType = _this$props2.momentType,
          type = _this$props2.type;
      var valueProp = this.props.value;
      var value = valueProp || valueProp === 0 ? Number(valueProp) : valueProp;

      if (!value && value !== 0) {
        return null;
      }

      if (type === 'date') {
        return I18n.moment.utc(value);
      }

      switch (momentType) {
        case MomentTypes.PORTAL:
          return I18n.moment.portalTz(value);

        case MomentTypes.USER:
          return I18n.moment.userTz(value);

        case MomentTypes.MOMENT:
          return I18n.moment(value);

        default:
          return undefined;
      }
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var moment = this.getMoment();

      if (moment) {
        return SimpleDate.fromMoment(moment);
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var className = this.props.className;
      var transferableProps = omit(['momentType', 'type', 'isInline', 'showPlaceholder', 'onTracking', 'isRequired'], Seq(this.props)).toJS();
      return /*#__PURE__*/_jsx(UIDateInput, Object.assign({}, transferableProps, {
        className: classNames('crm-property-date-input', className),
        inputRef: this.inputRef,
        onChange: this.handleChange,
        value: this.getValue()
      }));
    }
  }]);

  return CRMPropertyDateInput;
}(Component);

export { CRMPropertyDateInput as default };
CRMPropertyDateInput.propTypes = propTypes;
CRMPropertyDateInput.defaultProps = defaultProps;