'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { MOMENT_TYPES } from 'UIComponents/constants/MomentTypes';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { fromMoment, toMoment, toMomentPortalTz } from 'UIComponents/core/SimpleDate';
import UIDateInput from 'UIComponents/dates/UIDateInput';
import UIMicroDateInput from 'UIComponents/dates/UIMicroDateInput';
import ImmutableRenderMixin from 'react-immutable-render-mixin';

var toTimestamp = function toTimestamp(momentType, sd) {
  if (!sd) {
    return null;
  }

  if (momentType === MOMENT_TYPES.PORTAL) {
    return toMomentPortalTz(sd).valueOf();
  }

  return toMoment(sd).valueOf();
};

var CRMDateInput = createReactClass({
  displayName: 'CRMDateInput',
  propTypes: {
    clearLabel: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    momentType: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    size: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    'data-selenium-test': PropTypes.string,
    allowClearToNull: PropTypes.bool
  },
  mixins: [ImmutableRenderMixin],
  getDefaultProps: function getDefaultProps() {
    return {
      momentType: MOMENT_TYPES.USER,
      error: false,
      allowClearToNull: false
    };
  },
  focus: function focus() {
    if (this.refs.inputWrapper) {
      var _this$refs$inputWrapp = this.refs.inputWrapper.getElementsByTagName('input'),
          _this$refs$inputWrapp2 = _slicedToArray(_this$refs$inputWrapp, 1),
          input = _this$refs$inputWrapp2[0];

      input.focus();
    }
  },
  getMoment: function getMoment() {
    var shouldGetDefaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var momentType = this.props.momentType;
    var value = shouldGetDefaultValue ? Date.now() : this.getTimestamp();

    if (value == null || value === '') {
      return null;
    }

    switch (momentType) {
      case MOMENT_TYPES.PORTAL:
        return I18n.moment.portalTz(value);

      case MOMENT_TYPES.USER:
        return I18n.moment.userTz(value);

      case MOMENT_TYPES.MOMENT:
        return I18n.moment(value);

      default:
        return null;
    }
  },
  getTimestamp: function getTimestamp() {
    var value = this.props.value;

    if (value == null || value === '') {
      return null;
    }

    return +value;
  },
  getValue: function getValue() {
    var shouldGetDefaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var moment = this.getMoment(shouldGetDefaultValue);

    if (moment) {
      return fromMoment(moment);
    } else {
      return moment;
    }
  },
  handleChange: function handleChange(evt) {
    var _this$props = this.props,
        onChange = _this$props.onChange,
        momentType = _this$props.momentType;

    if (typeof onChange !== 'function') {
      return null;
    }

    var timestamp = toTimestamp(momentType, evt.target.value); // some places in the CRM we can't allow the date to be cleared to null
    // as it's used in fields where dates are requiered (i.e. timeline events)
    // so we need to default to "today" in that case

    if (isNaN(timestamp) || !timestamp && !this.props.allowClearToNull) {
      return onChange(Object.assign({}, evt, {
        target: Object.assign({}, evt.target, {
          value: toTimestamp(momentType, this.getValue(true))
        })
      }));
    }

    return onChange(Object.assign({}, evt, {
      target: Object.assign({}, evt.target, {
        value: timestamp
      })
    }));
  },
  render: function render() {
    var _this$props2 = this.props,
        __momentType = _this$props2.momentType,
        __disabled = _this$props2.disabled,
        __clearLabel = _this$props2.clearLabel,
        __size = _this$props2.size,
        transferableProps = _objectWithoutProperties(_this$props2, ["momentType", "disabled", "clearLabel", "size"]);

    var DateInput = this.props.size === 'small' ? UIMicroDateInput : UIDateInput;
    return /*#__PURE__*/_jsx("div", {
      ref: "inputWrapper",
      children: /*#__PURE__*/_jsx(DateInput, Object.assign({}, transferableProps, {
        onChange: this.handleChange,
        value: this.getValue(),
        disabled: this.props.disabled,
        error: this.props.error,
        "data-selenium-test": this.props['data-selenium-test'] || 'crm-date-input'
      }))
    });
  }
});
export default CRMDateInput;