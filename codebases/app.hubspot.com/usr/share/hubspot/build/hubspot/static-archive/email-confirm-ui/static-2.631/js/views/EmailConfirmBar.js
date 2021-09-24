'use es6';

import I18n from 'I18n';
import { EMAIL_CONFIRM_ACTIONS_ID } from '../constants/DOMSelectors';
import ResendVerificationEmailButton from './ResendVerificationEmailButton';

var EmailConfirmBarTemplate = function EmailConfirmBarTemplate(email) {
  return "\n    <div\n      class=\"fire-alarm_alarm fire-alarm_maintenance fire-alarm_borderless\"\n      role=\"alert\"\n      aria-live=\"assertive\"\n      aria-atomic=\"true\">\n        <div class=\"fire-alarm_alarm-inner\">\n          <div class=\"fire-alarm_alarm-body p-all-2\">\n            <p class=\"display-inline\">" + I18n.text('emailConfirmBar.title', {
    email: email
  }) + "</p>\n            <div class=\"display-inline\" id=\"" + EMAIL_CONFIRM_ACTIONS_ID + "\">\n              " + ResendVerificationEmailButton() + "\n            </div>\n          </div>\n        </div>\n    </div>\n  ";
};

export default EmailConfirmBarTemplate;