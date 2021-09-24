'use es6';

import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import PortalIdParser from 'PortalIdParser';
import enviro from 'enviro';
export default function (error) {
  var BETPortalId = enviro.isQa() ? 99535353 : 53;

  if (BETPortalId === PortalIdParser.get() && error.xhr && error.xhr.responseText) {
    var message = JSON.parse(error.xhr.responseText).message;
    FloatingAlertStore.addAlert({
      message: message,
      type: 'warning'
    });
    return;
  }

  addError('customerDataProperties.alertUpdatePropertiesError');
}