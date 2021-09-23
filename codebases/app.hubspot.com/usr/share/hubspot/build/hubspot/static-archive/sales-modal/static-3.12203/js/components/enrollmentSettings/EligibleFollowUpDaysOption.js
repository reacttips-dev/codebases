'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { List } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { BUSINESS_DAYS, EVERYDAY } from 'sales-modal/constants/EligibleFollowUpDays';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import UIToggle from 'UIComponents/input/UIToggle';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var EligibleFollowUpDaysOption = function EligibleFollowUpDaysOption(_ref) {
  var eligibleFollowUpDays = _ref.eligibleFollowUpDays,
      handleTempSettingsUpdate = _ref.handleTempSettingsUpdate,
      stepEnrollments = _ref.stepEnrollments,
      readOnly = _ref.readOnly;
  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: readOnly || !stepEnrollments,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.sequenceOptions.enrollmentSettings.general.tooltip"
    }),
    children: /*#__PURE__*/_jsx(UIInlineLabel, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'enrollModal.sequenceOptions.enrollmentSettings.general.followUpDays.label'
      }),
      children: /*#__PURE__*/_jsx(UIToggle, {
        size: "extra-small",
        checked: eligibleFollowUpDays === BUSINESS_DAYS,
        onChange: function onChange(_ref2) {
          var checked = _ref2.target.checked;
          var newValue = checked ? BUSINESS_DAYS : EVERYDAY;
          handleTempSettingsUpdate('eligibleFollowUpDays', newValue);
          UsageTracker.track('sequencesUsage', {
            action: "Toggled send follow-ups on weekdays only " + (newValue === EVERYDAY ? 'off' : 'on'),
            subscreen: 'enroll'
          });
        },
        readOnly: !!stepEnrollments || readOnly
      })
    })
  });
};

EligibleFollowUpDaysOption.propTypes = {
  eligibleFollowUpDays: PropTypes.string.isRequired,
  handleTempSettingsUpdate: PropTypes.func.isRequired,
  stepEnrollments: PropTypes.instanceOf(List),
  readOnly: PropTypes.bool.isRequired
};
export default EligibleFollowUpDaysOption;