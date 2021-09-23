'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import { tracker } from 'SequencesUI/util/UsageTracker';
import SettingsTileToggle from './SettingsTileToggle';

var EligibleFollowUpDaysOption = function EligibleFollowUpDaysOption(_ref) {
  var sequenceSettings = _ref.sequenceSettings,
      handleUpdateSettings = _ref.handleUpdateSettings,
      readOnly = _ref.readOnly;
  var eligibleFollowUpDays = sequenceSettings.get('eligibleFollowUpDays');

  var onChange = function onChange(_ref2) {
    var checked = _ref2.target.checked;
    var value = checked ? EligibleFollowUpDays.BUSINESS_DAYS : EligibleFollowUpDays.EVERYDAY;
    var updatedSettings = sequenceSettings.set('eligibleFollowUpDays', value);
    tracker.track('createOrEditSequence', {
      action: 'Toggled send weekdays only'
    });
    handleUpdateSettings(updatedSettings);
  };

  var checked = eligibleFollowUpDays === EligibleFollowUpDays.BUSINESS_DAYS;
  return /*#__PURE__*/_jsx(SettingsTileToggle, {
    labelNode: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.settings.general.followUpDays.label"
    }),
    helpNode: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.settings.general.followUpDays.help"
    }),
    inputId: "business-days-only-toggle",
    readOnly: readOnly,
    checked: checked,
    onChange: onChange
  });
};

EligibleFollowUpDaysOption.propTypes = {
  sequenceSettings: PropTypes.instanceOf(ImmutableMap).isRequired,
  handleUpdateSettings: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};
export default EligibleFollowUpDaysOption;