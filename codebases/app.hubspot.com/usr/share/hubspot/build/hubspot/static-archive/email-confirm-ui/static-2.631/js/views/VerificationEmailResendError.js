'use es6';

import I18n from 'I18n';

var VerificationEmailResendError = function VerificationEmailResendError() {
  return "\n  <p class=\"display-inline\">\n    <strong>" + I18n.text('emailConfirmBar.resendErrorText') + "</strong>\n  </p>\n";
};

export default VerificationEmailResendError;