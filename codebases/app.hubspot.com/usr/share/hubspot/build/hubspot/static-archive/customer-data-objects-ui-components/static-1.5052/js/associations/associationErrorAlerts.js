'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { COMPANY_TO_CONTACT, DEAL_TO_CONTACT, TICKET_TO_CONTACT, CONTACT_TO_DEAL, COMPANY_TO_DEAL, TICKET_TO_DEAL, CONTACT_TO_TICKET, COMPANY_TO_TICKET, DEAL_TO_TICKET } from 'customer-data-objects/associations/AssociationTypes';
var ASSOCIATION_LIMIT_EXCEEDED = 'ASSOCIATION_LIMIT_EXCEEDED';
var DEFAULT_ASSOCIATION_LIMIT = '10000';
var associationTypeRegex = /associationType ([A-Z]+_TO_[A-Z]+)/;
export function formatAssociationLimitExceededMessage(_ref) {
  var limitExceededError = _ref.limitExceededError;
  var regexResults = limitExceededError.match(associationTypeRegex);
  var associationType = regexResults && regexResults[1];

  switch (associationType) {
    case COMPANY_TO_CONTACT:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.COMPANY_TO_CONTACT';

    case DEAL_TO_CONTACT:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.DEAL_TO_CONTACT';

    case TICKET_TO_CONTACT:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.TICKET_TO_CONTACT';

    case CONTACT_TO_DEAL:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.CONTACT_TO_DEAL';

    case COMPANY_TO_DEAL:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.COMPANY_TO_DEAL';

    case TICKET_TO_DEAL:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.TICKET_TO_DEAL';

    case CONTACT_TO_TICKET:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.CONTACT_TO_TICKET';

    case COMPANY_TO_TICKET:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.COMPANY_TO_TICKET';

    case DEAL_TO_TICKET:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.DEAL_TO_TICKET';

    default:
      return 'customerDataObjectsUiComponents.Association.associationFailedError.associationLimitExceeded.generic';
  }
}
export function addRecordAssociationErrorAlert(_ref2) {
  var errorJSON = _ref2.errorJSON;

  if (errorJSON.errorType === 'UNIQUE_VALUE_CONFLICT') {
    var message = 'crm_components.GenericModal.unableToCreate.duplicatePropertyValue';
    var messageOptions = {
      propertyName: errorJSON.errorTokens.propertyName[0]
    };
    FloatingAlertStore.addAlert({
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: message,
        options: messageOptions
      }),
      type: 'warning',
      'data-alert-type': 'warning'
    });
  } else if (errorJSON && errorJSON.errorTokens && errorJSON.errorTokens[ASSOCIATION_LIMIT_EXCEEDED] && errorJSON.errorTokens[ASSOCIATION_LIMIT_EXCEEDED][0]) {
    FloatingAlertStore.addAlert({
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: formatAssociationLimitExceededMessage({
          limitExceededError: errorJSON.errorTokens[ASSOCIATION_LIMIT_EXCEEDED][0]
        }),
        options: {
          associationLimit: I18n.formatNumber(DEFAULT_ASSOCIATION_LIMIT)
        }
      }),
      type: 'warning',
      'data-alert-type': 'warning'
    });
  } else {
    FloatingAlertStore.addAlert({
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataObjectsUiComponents.Association.associationFailedError.generic"
      }),
      type: 'warning',
      'data-alert-type': 'warning'
    });
  }
}