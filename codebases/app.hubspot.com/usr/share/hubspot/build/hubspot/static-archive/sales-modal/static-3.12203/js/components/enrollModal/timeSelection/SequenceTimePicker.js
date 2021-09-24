'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap, List } from 'immutable';
import { convertToTimeObject, getRecommendedValueForStep } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITimePicker from 'UIComponents/input/UITimePicker';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import { ReadOnlyTime } from './ReadOnlyTime';
import FollowUpEmailTimePickerWithRecommendedTimes from './FollowUpEmailTimePickerWithRecommendedTimes';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';

var SequenceTimePicker = function SequenceTimePicker(_ref) {
  var step = _ref.step,
      sequenceEnrollment = _ref.sequenceEnrollment,
      enrollType = _ref.enrollType,
      onChange = _ref.onChange,
      _ref$allowEdit = _ref.allowEdit,
      allowEdit = _ref$allowEdit === void 0 ? true : _ref$allowEdit,
      isPrimarySequence = _ref.isPrimarySequence,
      recommendedSendTimes = _ref.recommendedSendTimes;
  var timeSelection;
  var stepType = step.get('action');
  var timeOfDay = step.get('timeOfDay');
  var value = convertToTimeObject(timeOfDay);

  if (enrollType === EnrollTypes.BULK_ENROLL && stepType === SEND_TEMPLATE) {
    var _sequenceEnrollment$s = sequenceEnrollment.sequenceSettings,
        startOfTimeRange = _sequenceEnrollment$s.sendWindowStartsAtMin,
        endOfTimeRange = _sequenceEnrollment$s.sendWindowEndsAtMin;
    timeSelection = /*#__PURE__*/_jsxs(UIFlex, {
      className: "sequence-enroll-modal-send-times",
      align: "center",
      children: [allowEdit ? /*#__PURE__*/_jsx(UITimePicker, {
        "data-unit-test": "time-range-input",
        interval: 1,
        value: startOfTimeRange
      }) : /*#__PURE__*/_jsx(ReadOnlyTime, {
        "data-unit-test": "time-range-display",
        showIcon: true,
        value: startOfTimeRange
      }), /*#__PURE__*/_jsx(UIIcon, {
        name: "next",
        size: 11
      }), allowEdit ? /*#__PURE__*/_jsx(UITimePicker, {
        "data-unit-test": "time-range-input",
        interval: 1,
        value: endOfTimeRange
      }) : /*#__PURE__*/_jsx(ReadOnlyTime, {
        "data-unit-test": "time-range-display",
        showIcon: false,
        value: endOfTimeRange
      })]
    });
  } else if (stepType === SEND_TEMPLATE) {
    timeSelection = /*#__PURE__*/_jsx(FollowUpEmailTimePickerWithRecommendedTimes, {
      onChange: onChange,
      value: value,
      recommendedValue: getRecommendedValueForStep(recommendedSendTimes, step, sequenceEnrollment.timezone),
      enrollType: enrollType
    });
  } else {
    timeSelection = /*#__PURE__*/_jsx("span", {
      children: allowEdit ? /*#__PURE__*/_jsx(UITimePicker, {
        className: "m-left-1",
        "data-unit-test": "time-input",
        interval: 1,
        onChange: onChange,
        placement: "bottom left",
        readOnly: !allowEdit || enrollType === EnrollTypes.VIEW,
        value: value
      }) : /*#__PURE__*/_jsx(ReadOnlyTime, {
        "data-unit-test": "time-display",
        showIcon: true,
        value: value
      })
    });
  }

  var message = isPrimarySequence ? "enrollModal.sendTimes.bulkEnrollDisabled.timeSelection.primarySequence." + stepType.toLowerCase() : "enrollModal.sendTimes.bulkEnrollDisabled.timeSelection.contactEnrollment." + stepType.toLowerCase();
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: message
    }),
    disabled: allowEdit,
    children: timeSelection
  });
};

SequenceTimePicker.propTypes = {
  step: PropTypes.instanceOf(ImmutableMap).isRequired,
  sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
  enrollType: EnrollTypePropType.isRequired,
  onChange: PropTypes.func.isRequired,
  allowEdit: PropTypes.bool,
  isPrimarySequence: PropTypes.bool.isRequired,
  recommendedSendTimes: PropTypes.instanceOf(List)
};
export default SequenceTimePicker;