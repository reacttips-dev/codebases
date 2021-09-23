'use es6';

import I18n from 'I18n';
import DeleteObjectPrompt from 'customer-data-objects-ui-components/prompt/DeleteObjectPrompt';
export default function (onConfirm, onReject, email) {
  var title = I18n.text('customerDataProperties.DeleteEmailPrompt.emailTitle', {
    email: email
  });
  var confirmLabel = I18n.text('customerDataProperties.DeleteEmailPrompt.buttonText');
  var message = I18n.text('customerDataProperties.DeleteEmailPrompt.emailMessage');
  return DeleteObjectPrompt({
    callback: onConfirm,
    onReject: onReject,
    confirmLabel: confirmLabel,
    message: message,
    title: title
  });
}