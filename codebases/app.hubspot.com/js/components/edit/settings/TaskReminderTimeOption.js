'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker } from 'SequencesUI/util/UsageTracker';
import debounce from 'transmute/debounce';
import styled from 'styled-components';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UITileSection from 'UIComponents/tile/UITileSection';
import UITimeInput from 'UIComponents/input/UITimeInput';
import SettingsTileToggle from './SettingsTileToggle';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
export var StyledUITimeInput = styled(UITimeInput).attrs(function () {
  return {
    interval: 15
  };
}).withConfig({
  displayName: "TaskReminderTimeOption__StyledUITimeInput",
  componentId: "sc-1hr56ez-0"
})(["width:140px !important;"]);

var TaskCreationTimeOption = function TaskCreationTimeOption(_ref) {
  var sequenceSettings = _ref.sequenceSettings,
      handleUpdateSettings = _ref.handleUpdateSettings,
      readOnly = _ref.readOnly;

  var onChangeTime = function onChangeTime(_ref2) {
    var value = _ref2.currentTarget.value;
    if (!value && value !== 0) return;
    var updatedSettings = sequenceSettings.set('taskReminderMinute', value);
    tracker.track('createOrEditSequence', {
      action: 'Changed time of task reminders',
      time: I18n.moment.utc(0).minutes(value).format('HH:mm')
    });
    handleUpdateSettings(updatedSettings);
  };

  var debouncedOnChangeTime = useCallback(debounce(100, onChangeTime), [sequenceSettings, handleUpdateSettings]);

  var onChangeToggle = function onChangeToggle(_ref3) {
    var checked = _ref3.target.checked;
    var updatedSettings = sequenceSettings.set('individualTaskRemindersEnabled', checked);
    tracker.track('createOrEditSequence', {
      action: 'Toggled sending task reminders'
    });
    handleUpdateSettings(updatedSettings);
  };

  var checked = sequenceSettings.get('individualTaskRemindersEnabled');

  var renderTimeInputSection = function renderTimeInputSection() {
    return /*#__PURE__*/_jsxs(UITileSection, {
      children: [/*#__PURE__*/_jsx(UIFormLabel, {
        htmlFor: "task-reminder-time-input",
        readOnly: readOnly,
        className: "p-top-0",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.settings.tasks.timeInputLabel"
        })
      }), /*#__PURE__*/_jsx(EditSequenceTooltip, {
        children: /*#__PURE__*/_jsx(StyledUITimeInput, {
          id: "task-reminder-time-input",
          value: sequenceSettings.get('taskReminderMinute'),
          onChange: debouncedOnChangeTime,
          readOnly: readOnly
        })
      })]
    });
  };

  return /*#__PURE__*/_jsx(SettingsTileToggle, {
    labelNode: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.settings.tasks.label"
    }),
    helpNode: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.settings.tasks.help"
    }),
    inputId: "use-task-reminders-toggle",
    checked: checked,
    onChange: onChangeToggle,
    readOnly: readOnly,
    additionalTileSection: checked ? renderTimeInputSection() : null
  });
};

TaskCreationTimeOption.propTypes = {
  sequenceSettings: PropTypes.instanceOf(ImmutableMap).isRequired,
  handleUpdateSettings: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};
export default TaskCreationTimeOption;