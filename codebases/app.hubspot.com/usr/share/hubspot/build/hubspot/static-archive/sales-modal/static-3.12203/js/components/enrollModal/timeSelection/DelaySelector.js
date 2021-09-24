'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UISelect from 'UIComponents/input/UISelect';
import UIStepperInput from 'UIComponents/input/UIStepperInput';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import * as SequenceStepTypes from 'sales-modal/constants/SequenceStepTypes';
import { DAY } from 'sales-modal/constants/Milliseconds';
import * as DelayOptionTypes from 'sales-modal/constants/DelayOptionTypes';
import { getDelayOptions } from 'sales-modal/utils/enrollModal/delaySelectorUtils';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
var DelayValueStepperInput = styled(UIStepperInput).attrs(function () {
  return {
    max: 90,
    min: 1,
    stepSize: 1
  };
}).withConfig({
  displayName: "DelaySelector__DelayValueStepperInput",
  componentId: "sc-1aaey5m-0"
})(["width:80px !important;"]);
var DelaySelector = createReactClass({
  displayName: "DelaySelector",
  propTypes: {
    delay: PropTypes.number.isRequired,
    handleUpdateDelay: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    isPrimarySequence: PropTypes.bool.isRequired,
    enrollType: EnrollTypePropType.isRequired,
    readOnly: PropTypes.bool,
    sendOnWeekdays: PropTypes.bool.isRequired,
    stepType: PropTypes.oneOf(Object.values(SequenceStepTypes || {})).isRequired
  },
  mixins: [PureRenderMixin],
  getDefaultProps: function getDefaultProps() {
    return {
      readOnly: false
    };
  },
  getOption: function getOption() {
    var delay = this.props.delay;

    if (delay === 0) {
      return DelayOptionTypes.NO_DELAY;
    }

    return DelayOptionTypes.DELAY;
  },
  getDelay: function getDelay(val) {
    var num = val ? parseInt(val, 10) : 1;
    return num * DAY;
  },
  getDelayInUnits: function getDelayInUnits() {
    var delay = this.props.delay;
    return delay / DAY;
  },
  handleOptionChange: function handleOptionChange(e) {
    var handleUpdateDelay = this.props.handleUpdateDelay;
    var value = e.target.value === DelayOptionTypes.DELAY ? 1 : 0;
    var updatedDelay = DAY * value;
    handleUpdateDelay(updatedDelay, 'option');
  },
  handleDelayChange: function handleDelayChange(e) {
    var handleUpdateDelay = this.props.handleUpdateDelay;
    var delay = this.getDelay(e.target.value);
    handleUpdateDelay(delay, 'number');
  },
  getDelayUnitTooltip: function getDelayUnitTooltip() {
    var _this$props = this.props,
        isPrimarySequence = _this$props.isPrimarySequence,
        sendOnWeekdays = _this$props.sendOnWeekdays,
        enrollType = _this$props.enrollType;
    var settingsLocationKey = enrollType !== EnrollTypes.BULK_ENROLL || isPrimarySequence ? 'primarySequence' : 'contactEnrollment';
    var sendDaysPreference = sendOnWeekdays ? 'businessDays' : 'days';
    return "enrollModal.delaySelector.delayUnitTooltip." + settingsLocationKey + "." + sendDaysPreference;
  },
  wrapWithDisabledTooltip: function wrapWithDisabledTooltip(component) {
    var _this$props2 = this.props,
        readOnly = _this$props2.readOnly,
        stepType = _this$props2.stepType;

    if (readOnly) {
      return /*#__PURE__*/_jsx(UITooltip, {
        placement: "top",
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: stepType === SequenceStepTypes.SCHEDULE_TASK ? 'enrollModal.sendTimes.bulkEnrollDisabled.delaySelection.schedule_task_V2' : 'enrollModal.sendTimes.bulkEnrollDisabled.delaySelection.send_template'
        }),
        children: /*#__PURE__*/_jsx("span", {
          children: component
        })
      });
    }

    return component;
  },
  renderDelayOption: function renderDelayOption() {
    var _this$props3 = this.props,
        readOnly = _this$props3.readOnly,
        stepType = _this$props3.stepType,
        enrollType = _this$props3.enrollType;
    var delayOption = this.getOption();

    if (stepType === SequenceStepTypes.SEND_TEMPLATE) {
      return /*#__PURE__*/_jsx("span", {
        className: "delay-selector-email-action",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.delaySelector.sendEmailIfNoActionWithin"
        })
      });
    }

    return this.wrapWithDisabledTooltip( /*#__PURE__*/_jsx(UISelect, {
      className: "delay-selector-dropdowns__option",
      closeOnTargetLeave: true,
      onChange: this.handleOptionChange,
      options: getDelayOptions(),
      readOnly: readOnly || enrollType === EnrollTypes.VIEW,
      value: delayOption
    }));
  },
  renderDelayValue: function renderDelayValue() {
    var _this$props4 = this.props,
        delay = _this$props4.delay,
        readOnly = _this$props4.readOnly,
        enrollType = _this$props4.enrollType,
        hasError = _this$props4.hasError;

    if (delay === 0) {
      return null;
    }

    return this.wrapWithDisabledTooltip( /*#__PURE__*/_jsx(DelayValueStepperInput, {
      "data-test-id": "delay-value-stepper-input",
      className: "m-left-2",
      readOnly: readOnly || enrollType === EnrollTypes.VIEW,
      onChange: this.handleDelayChange,
      value: this.getDelayInUnits(),
      disabledMaxButtonTooltip: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.delaySelector.stepper.maxDelayTooltip"
      }),
      disabledMinButtonTooltip: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.delaySelector.stepper.minDelayTooltip"
      }),
      error: hasError
    }));
  },
  renderDelayUnit: function renderDelayUnit() {
    var _this$props5 = this.props,
        delay = _this$props5.delay,
        sendOnWeekdays = _this$props5.sendOnWeekdays;

    if (delay === 0) {
      return null;
    }

    var message = sendOnWeekdays ? 'enrollModal.delaySelector.delayUnitText.businessDays' : 'enrollModal.delaySelector.delayUnitText.days';
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        "data-test-id": "delay-unit-text",
        className: "delay-selector-email-action m-left-2",
        message: message,
        options: {
          count: this.getDelayInUnits()
        }
      }), /*#__PURE__*/_jsx(UIHelpIcon, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: this.getDelayUnitTooltip()
        }),
        tooltipPlacement: "top",
        className: "m-left-1"
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      className: "sequence-step-delay-selector",
      direction: "row",
      children: [this.renderDelayOption(), this.renderDelayValue(), this.renderDelayUnit()]
    });
  }
});
export default DelaySelector;