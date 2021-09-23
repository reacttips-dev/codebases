'use es6';

import I18n from 'I18n';
import { RESEND_VERIFICATION_EMAIL_BUTTON_ID } from '../constants/DOMSelectors';

var ResendVerificationEmailButton = function ResendVerificationEmailButton() {
  return "\n  <a class=\"fire-alarm_alarm-status-page-link uiLinkWithUnderline\" id=\"" + RESEND_VERIFICATION_EMAIL_BUTTON_ID + "\" style=\"cursor: pointer;\">\n    " + I18n.text('emailConfirmBar.resendButton') + "\n  </a>\n";
};

export default ResendVerificationEmailButton;