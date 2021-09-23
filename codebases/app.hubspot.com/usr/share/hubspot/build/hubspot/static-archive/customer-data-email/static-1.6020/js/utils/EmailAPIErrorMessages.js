'use es6';

import isValidI18nKey from 'I18n/utils/isValidI18nKey';
import * as EmailAPIErrorTypes from '../constants/EmailAPIErrorTypes';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
import PortalIdParser from 'PortalIdParser';

function getEmail(email) {
  return email && (email.substring(email.indexOf('<') + 1, email.indexOf('>')) || email);
}

export var getEmailApiErrorLangKey = function getEmailApiErrorLangKey(errorType) {
  if (!isValidI18nKey("customerDataEmail.Email.api.errors." + errorType)) {
    logError({
      error: new Error("[EmailApi] Error Message Key not found for errorType: " + errorType)
    });
    return "customerDataEmail.Email.api.errors." + EmailAPIErrorTypes.GENERIC;
  }

  return "customerDataEmail.Email.api.errors." + errorType;
}; // returns properties for customer-data-ui-utilities/alerts/Alerts

export var getEmailApiAlertOptions = function getEmailApiAlertOptions(_ref) {
  var errorType = _ref.errorType,
      emailRecord = _ref.emailRecord,
      _ref$defaultMessage = _ref.defaultMessage,
      defaultMessage = _ref$defaultMessage === void 0 ? "customerDataEmail.Email.api.errors." + EmailAPIErrorTypes.GENERIC : _ref$defaultMessage,
      _ref$isUngatedForEmai = _ref.isUngatedForEmailSettingsMigration,
      isUngatedForEmailSettingsMigration = _ref$isUngatedForEmai === void 0 ? false : _ref$isUngatedForEmai;
  var options = {
    _defaultMessage: defaultMessage
  };
  var message = defaultMessage;

  if (errorType) {
    var updatedErrorType = errorType.toUpperCase();

    if (errorType === EmailAPIErrorTypes.BLACKLISTED_EMAIL_IN_RECIPIENTS) {
      options.toAddress = emailRecord && emailRecord.to && emailRecord.to.first() && getEmail(emailRecord.to.first());
      updatedErrorType = options.toAddress ? errorType : EmailAPIErrorTypes.BLACKLISTED_EMAIL_IN_RECIPIENTS_NO_EMAIL;
    }

    if (updatedErrorType.includes(EmailAPIErrorTypes.EMAIL_SENDING_API_ERROR)) {
      options.settingsUrl = isUngatedForEmailSettingsMigration ? "/settings/" + PortalIdParser.get() + "/user-preferences/email" : "/crm-settings-email/" + PortalIdParser.get() + "/email/connectedEmails";
    }

    if (errorType.includes(EmailAPIErrorTypes.CONVERSATIONS_HOSTED_EMAIL_ACCESS_SCOPE_NOT_FOUND)) {
      options.emailAccount = emailRecord.getIn(['from', 'email']);
    }

    message = getEmailApiErrorLangKey(updatedErrorType);
  }

  return {
    message: message,
    options: options
  };
};