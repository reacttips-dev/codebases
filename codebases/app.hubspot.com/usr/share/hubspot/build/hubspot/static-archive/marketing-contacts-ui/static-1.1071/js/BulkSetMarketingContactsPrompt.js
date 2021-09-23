'use es6';

import BulkSetMarketingContactsDialogContainer from './BulkSetMarketingContactsDialogContainer';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import I18n from 'I18n';
import Promptable from 'UIComponents/decorators/Promptable';
import markEligible from 'marketing-contacts-client/api/markEligible';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';

var _bulkSetMarketablePrompt = Promptable(BulkSetMarketingContactsDialogContainer);

var _onSuccess = function _onSuccess(count) {
  return function () {
    FloatingAlertStore.addAlert({
      message: I18n.text('marketing-contacts-ui.alerts.success.subtitle', {
        count: count
      }),
      titleText: I18n.text('marketing-contacts-ui.alerts.success.title'),
      type: 'success'
    });
  };
};

var _onError = function _onError() {
  FloatingAlertStore.addAlert({
    message: I18n.text('marketing-contacts-ui.alerts.error.subtitle'),
    titleText: I18n.text('marketing-contacts-ui.alerts.error.title'),
    type: 'danger'
  });
};

export default function (params) {
  var query = params.query,
      source = params.source;

  if (!source) {
    console.error('source required for marking contacts as eligible');
    return;
  }

  _bulkSetMarketablePrompt(params).then(function (_ref) {
    var applyToAll = _ref.applyToAll,
        nonMarketingCount = _ref.nonMarketingCount;
    return markEligible({
      query: query,
      applyToAll: applyToAll,
      expectedNumberObjectsModified: nonMarketingCount,
      source: source
    }).then(_onSuccess(nonMarketingCount), _onError).done();
  }, rethrowError).done();
}