'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { List } from 'immutable';
import I18n from 'I18n';
import * as SequenceStepTypes from 'sales-modal/constants/SequenceStepTypes';
import * as SimpleDate from 'UIComponents/core/SimpleDate';
import { SimpleDateType } from 'UIComponents/types/SimpleDateTypes';
import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import getSequenceStartDatePickerOptions from 'sales-modal/utils/enrollModal/getSequenceStartDatePickerOptions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UISelect from 'UIComponents/input/UISelect';
import UIDateInput from 'UIComponents/dates/UIDateInput';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UITimePicker from 'UIComponents/input/UITimePicker';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import AllContactsBulkEnrollTourStep from 'sales-modal/components/bulkEnroll/shepherdTour/AllContactsBulkEnrollTourStep';
import { convertToTimeObject } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import getLastFinishedEmailStep from 'sales-modal/utils/enrollModal/getLastFinishedEmailStep';
import { getSendTimesToValidate } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import * as SequencesApi from 'sales-modal/api/SequencesApi';
import UIBox from 'UIComponents/layout/UIBox';
import { ReadOnlyTime } from './ReadOnlyTime';
import { EnrollTypePropType, EnrollTypes } from 'sales-modal/constants/EnrollTypes';
var SequenceStartDatePicker = createReactClass({
  displayName: "SequenceStartDatePicker",
  propTypes: {
    stepEnrollments: PropTypes.instanceOf(List),
    enrollType: EnrollTypePropType,
    firstSendType: PropTypes.string.isRequired,
    firstStepDate: SimpleDateType.isRequired,
    fromEmail: PropTypes.string.isRequired,
    handleDatePicker: PropTypes.func.isRequired,
    handleFirstSendTypeChange: PropTypes.func.isRequired,
    handleUpdateTime: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool,
    sendOnWeekdays: PropTypes.bool.isRequired,
    startingStepOrder: PropTypes.number.isRequired,
    stepType: PropTypes.oneOf(Object.values(SequenceStepTypes || {})).isRequired,
    stepIndex: PropTypes.number.isRequired,
    timeOfDay: PropTypes.number.isRequired,
    timezone: PropTypes.string.isRequired
  },
  contextTypes: {
    bulkEnrollTour: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      readOnly: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      datesWithErrors: List()
    };
  },
  componentDidMount: function componentDidMount() {
    this._isMounted = true;

    if (this.props.stepType === SequenceStepTypes.SEND_TEMPLATE) {
      this.fetchSendLimitsForFutureDates();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.timezone !== prevProps.timezone || this.props.sendOnWeekdays !== prevProps.sendOnWeekdays || this.props.fromEmail !== prevProps.fromEmail) {
      this.fetchSendLimitsForFutureDates();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this._isMounted = false;
  },
  fetchSendLimitsForFutureDates: function fetchSendLimitsForFutureDates() {
    var _this = this;

    var _this$props = this.props,
        fromEmail = _this$props.fromEmail,
        timezone = _this$props.timezone,
        sendOnWeekdays = _this$props.sendOnWeekdays,
        enrollType = _this$props.enrollType;
    var currentTimestamp = I18n.moment().valueOf();
    var executeTimes = List([currentTimestamp]).concat(getSendTimesToValidate({
      previousStepSendTime: currentTimestamp,
      sendOnWeekdays: sendOnWeekdays,
      rangeEnd: 15
    }));

    if (enrollType === EnrollTypes.VIEW) {
      return;
    }

    SequencesApi.fetchSendLimitsForFutureDates(timezone, fromEmail, executeTimes.toArray()).then(function (response) {
      if (_this._isMounted) {
        var datesWithErrors = response.filter(function (limit) {
          return !limit.get('availableSendsUntilMidnight');
        }).keySeq().map(Number).toList();

        _this.setState({
          datesWithErrors: datesWithErrors
        });
      }
    });
  },
  wrapWithReadOnlyTooltip: function wrapWithReadOnlyTooltip(component) {
    var _this$props2 = this.props,
        readOnly = _this$props2.readOnly,
        stepType = _this$props2.stepType;

    if (readOnly) {
      return /*#__PURE__*/_jsx(UITooltip, {
        placement: "top",
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: stepType === SequenceStepTypes.SCHEDULE_TASK ? 'enrollModal.sendTimes.bulkEnrollDisabled.firstSendTime.schedule_task_V2' : 'enrollModal.sendTimes.bulkEnrollDisabled.firstSendTime.send_template'
        }),
        children: /*#__PURE__*/_jsx("span", {
          children: component
        })
      });
    }

    return component;
  },
  renderDate: function renderDate() {
    var _this$props3 = this.props,
        stepEnrollments = _this$props3.stepEnrollments,
        sendOnWeekdays = _this$props3.sendOnWeekdays,
        firstStepDate = _this$props3.firstStepDate,
        firstSendType = _this$props3.firstSendType,
        handleDatePicker = _this$props3.handleDatePicker,
        hasError = _this$props3.hasError,
        readOnly = _this$props3.readOnly,
        timezone = _this$props3.timezone,
        stepType = _this$props3.stepType,
        enrollType = _this$props3.enrollType;

    if (firstSendType === SEND_IMMEDIATELY) {
      return null;
    }

    var disabledDates = [];

    if (sendOnWeekdays) {
      var disabledDayNums = [6, 7, 13, 14, 20, 21, 27, 28, 34, 35];
      disabledDates = disabledDayNums.map(function (num) {
        return SimpleDate.fromMoment(I18n.moment().day(num));
      });
    }

    disabledDates = disabledDates.concat(this.state.datesWithErrors.map(function (timestamp) {
      return SimpleDate.fromMoment(I18n.moment(timestamp).tz(timezone));
    }).toArray());
    var lastFinishedEmail = getLastFinishedEmailStep(stepEnrollments);

    if (lastFinishedEmail && stepType === SequenceStepTypes.SEND_TEMPLATE) {
      var lastFinishedEmailDate = I18n.moment(lastFinishedEmail.get('executedTimestamp')).tz(timezone);
      disabledDates.push(SimpleDate.fromMoment(lastFinishedEmailDate));
    }

    var nowWithTimezone = I18n.moment().tz(timezone);
    var minValue = SimpleDate.fromMoment(nowWithTimezone);
    var maxValue = SimpleDate.fromMoment(nowWithTimezone.add(6, 'month'));
    return /*#__PURE__*/_jsx("div", {
      className: "m-left-4",
      children: this.wrapWithReadOnlyTooltip( /*#__PURE__*/_jsx(UIDateInput, {
        "data-selenium-test": "starting-step-date-input",
        disabledValues: disabledDates,
        error: hasError,
        max: maxValue,
        min: minValue,
        onChange: handleDatePicker,
        readOnly: readOnly || enrollType === EnrollTypes.VIEW,
        value: firstStepDate
      }))
    });
  },
  renderTime: function renderTime() {
    var _this$props4 = this.props,
        firstSendType = _this$props4.firstSendType,
        handleUpdateTime = _this$props4.handleUpdateTime,
        readOnly = _this$props4.readOnly,
        hasError = _this$props4.hasError,
        stepType = _this$props4.stepType,
        timeOfDay = _this$props4.timeOfDay,
        enrollType = _this$props4.enrollType;

    if (firstSendType === SEND_IMMEDIATELY || stepType === SequenceStepTypes.SCHEDULE_TASK) {
      return null;
    }

    var value = convertToTimeObject(timeOfDay);
    return /*#__PURE__*/_jsx(UIBox, {
      basis: 150,
      className: "text-right",
      shrink: 1,
      children: /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [readOnly ? this.wrapWithReadOnlyTooltip( /*#__PURE__*/_jsx(ReadOnlyTime, {
          "data-unit-test": "time-display",
          showIcon: true,
          value: value
        })) : /*#__PURE__*/_jsx(UITimePicker, {
          className: "m-left-1",
          "data-unit-test": "time-input",
          interval: 1,
          onChange: handleUpdateTime,
          placement: "bottom left",
          value: value,
          readOnly: enrollType === EnrollTypes.VIEW
        }), !hasError && stepType === SequenceStepTypes.SEND_TEMPLATE && this.renderFirstSendTimeTooltip()]
      })
    });
  },
  renderFirstSendTimeTooltip: function renderFirstSendTimeTooltip() {
    var enrollType = this.props.enrollType;
    var message = enrollType === EnrollTypes.BULK_ENROLL ? 'enrollModal.sendTimes.firstSendTime.autoEmailTooltipMultiple_jsx' : 'enrollModal.sendTimes.firstSendTime.autoEmailTooltipSingle_jsx';
    return /*#__PURE__*/_jsx(UIHelpIcon, {
      className: "m-left-3",
      title: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: message,
        options: {
          href: sendLimitLearnMore(),
          external: true
        },
        elements: {
          Link: UILink
        }
      }),
      tooltipPlacement: "top left"
    });
  },
  renderHelperTooltip: function renderHelperTooltip() {
    var _this$props5 = this.props,
        stepType = _this$props5.stepType,
        firstSendType = _this$props5.firstSendType,
        hasError = _this$props5.hasError;

    if (!hasError && firstSendType === SEND_IMMEDIATELY && stepType === SequenceStepTypes.SEND_TEMPLATE) {
      return this.renderFirstSendTimeTooltip();
    }

    return null;
  },
  renderStartDateSelect: function renderStartDateSelect() {
    var _this$props6 = this.props,
        enrollType = _this$props6.enrollType,
        firstSendType = _this$props6.firstSendType,
        handleFirstSendTypeChange = _this$props6.handleFirstSendTypeChange,
        hasError = _this$props6.hasError,
        readOnly = _this$props6.readOnly,
        startingStepOrder = _this$props6.startingStepOrder,
        stepIndex = _this$props6.stepIndex,
        stepType = _this$props6.stepType;

    var startDateSelect = /*#__PURE__*/_jsx(UISelect, {
      "data-selenium-test": "sequence-step-start-date-type-selection",
      className: "sequence-step-start-date-type-selection",
      onChange: handleFirstSendTypeChange,
      options: getSequenceStartDatePickerOptions({
        enrollType: enrollType,
        startingStepOrder: startingStepOrder,
        stepIndex: stepIndex,
        stepType: stepType
      }),
      value: firstSendType,
      error: hasError && firstSendType === SEND_IMMEDIATELY,
      readOnly: readOnly || enrollType === EnrollTypes.VIEW,
      closeOnTargetLeave: true
    });

    if (enrollType === EnrollTypes.BULK_ENROLL && !readOnly) {
      return /*#__PURE__*/_jsx(AllContactsBulkEnrollTourStep, {
        onSkip: this.context.bulkEnrollTour.finishTour,
        children: startDateSelect
      });
    }

    return this.wrapWithReadOnlyTooltip(startDateSelect);
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      className: "sequence-step-start-date",
      justify: "between",
      children: [/*#__PURE__*/_jsx(UIBox, {
        children: /*#__PURE__*/_jsxs(UIFlex, {
          align: "center",
          children: [this.renderStartDateSelect(), this.renderHelperTooltip(), this.renderDate()]
        })
      }), this.renderTime()]
    });
  }
});
export default SequenceStartDatePicker;