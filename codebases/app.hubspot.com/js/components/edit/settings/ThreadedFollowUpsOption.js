'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { emailThreadingKB } from 'SequencesUI/lib/links';
import { tracker } from 'SequencesUI/util/UsageTracker';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import SettingsTileToggle from './SettingsTileToggle';

var ThreadedFollowUpsOption = function ThreadedFollowUpsOption(_ref) {
  var sequenceSettings = _ref.sequenceSettings,
      handleUpdateSettings = _ref.handleUpdateSettings,
      readOnly = _ref.readOnly;
  var useThreadedFollowUps = sequenceSettings.get('useThreadedFollowUps');

  var onChange = function onChange(_ref2) {
    var checked = _ref2.target.checked;
    var updatedSettings = sequenceSettings.set('useThreadedFollowUps', checked);
    tracker.track('createOrEditSequence', {
      action: 'Toggled thread follow-up emails'
    });
    handleUpdateSettings(updatedSettings);
  };

  var knowledgeBaseButton = /*#__PURE__*/_jsx(KnowledgeBaseButton, {
    url: emailThreadingKB(),
    external: true,
    useZorse: true
  });

  return /*#__PURE__*/_jsx(SettingsTileToggle, {
    distance: "flush",
    labelNode: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.settings.followUpEmails.subjectThreading.label"
    }),
    helpNode: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "edit.settings.followUpEmails.subjectThreading.help",
      options: {
        knowledgeBaseButton: knowledgeBaseButton
      }
    }),
    inputId: "subject-threading-toggle",
    readOnly: readOnly,
    checked: useThreadedFollowUps,
    onChange: onChange
  });
};

ThreadedFollowUpsOption.propTypes = {
  sequenceSettings: PropTypes.instanceOf(ImmutableMap).isRequired,
  handleUpdateSettings: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};
export default ThreadedFollowUpsOption;