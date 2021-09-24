'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { emailThreadingKB } from 'sales-modal/lib/links';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import UIToggle from 'UIComponents/input/UIToggle';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var EmailThreadingOption = function EmailThreadingOption(_ref) {
  var stepEnrollments = _ref.stepEnrollments,
      useThreadedFollowUps = _ref.useThreadedFollowUps,
      handleTempSettingsUpdate = _ref.handleTempSettingsUpdate,
      readOnly = _ref.readOnly;
  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: readOnly || !stepEnrollments,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.sequenceOptions.enrollmentSettings.general.tooltip"
    }),
    children: /*#__PURE__*/_jsx(UIInlineLabel, {
      label: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "enrollModal.sequenceOptions.enrollmentSettings.followUpEmails.subjectThreading.label_jsx",
        options: {
          url: emailThreadingKB(),
          external: true
        },
        elements: {
          Link: KnowledgeBaseButton
        }
      }),
      children: /*#__PURE__*/_jsx(UIToggle, {
        checked: useThreadedFollowUps,
        onChange: function onChange(e) {
          handleTempSettingsUpdate('useThreadedFollowUps', e.target.checked);
          UsageTracker.track('sequencesUsage', {
            action: "Toggled thread follow-ups " + (e.target.checked ? 'on' : 'off'),
            subscreen: 'enroll'
          });
        },
        size: "extra-small",
        readOnly: !!stepEnrollments || readOnly
      })
    })
  });
};

EmailThreadingOption.propTypes = {
  stepEnrollments: PropTypes.instanceOf(List),
  useThreadedFollowUps: PropTypes.bool.isRequired,
  handleTempSettingsUpdate: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
};
export default EmailThreadingOption;