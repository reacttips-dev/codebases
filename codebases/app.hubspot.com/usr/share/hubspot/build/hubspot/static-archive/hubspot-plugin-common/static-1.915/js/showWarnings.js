'use es6';

import quickFetch from 'quick-fetch';
import I18n from 'I18n';
import isValidI18nKey from 'I18n/utils/isValidI18nKey';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
var THIRTY_MINUTES = 1000 * 60 * 30;
export default function showWarnings() {
  if (window.location.pathname.indexOf('/reports-dashboard/') !== 0) return;
  var request = quickFetch.getRequestStateByName('api-verify');

  if (request) {
    request.whenFinished(function (data) {
      if (data.portal.enabled_gates.indexOf('WordPress:ReportingAlert') === -1) {
        return;
      }

      if (!isValidI18nKey('wordpress.reporting.notReady.title')) return;

      if (Date.now() - data.portal.created_at < THIRTY_MINUTES) {
        FloatingAlertStore.addAlert({
          // This component only renders something if it explicitly
          // includes `/reports-dashboard/` in the pathname
          // i18n-lint-disable-next-line require-i18n-message
          titleText: I18n.text('wordpress.reporting.notReady.title'),
          sticky: true,
          type: 'warning'
        });
      }
    });
  }
}