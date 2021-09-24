'use es6';

import I18n from 'I18n';

var VerificationEmailResentMessage = function VerificationEmailResentMessage() {
  return "\n  <p class=\"display-inline\">\n    <strong>" + I18n.text('emailConfirmBar.resentText') + "</strong>\n  </p>\n";
};

export default VerificationEmailResentMessage;