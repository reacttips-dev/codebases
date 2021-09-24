'use es6';

import BulkSetNonMarketingContactsDialogContainer from './BulkSetNonMarketingContactsDialogContainer';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import I18n from 'I18n';
import Promptable from 'UIComponents/decorators/Promptable';
import markIneligible from 'marketing-contacts-client/api/markIneligible';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';

var _bulkSetNonMarketablePrompt = Promptable(BulkSetNonMarketingContactsDialogContainer);

var _onSuccess = function _onSuccess(count) {
  return function () {
    FloatingAlertStore.addAlert({
      message: I18n.text('marketing-contacts-ui.bulkSetNonMarketingPrompt.alert.success.subtitle', {
        count: count
      }),
      titleText: I18n.text('marketing-contacts-ui.bulkSetNonMarketingPrompt.alert.success.title'),
      type: 'success'
    });
  };
};

var _onError = function _onError() {
  FloatingAlertStore.addAlert({
    message: I18n.text('marketing-contacts-ui.bulkSetNonMarketingPrompt.alert.error.subtitle'),
    titleText: I18n.text('marketing-contacts-ui.bulkSetNonMarketingPrompt.alert.error.title'),
    type: 'danger'
  });
};

export default function (params) {
  var query = params.query,
      source = params.source;

  if (!source) {
    console.error('source required for marking contacts as non-eligible');
    return;
  }

  _bulkSetNonMarketablePrompt(params).then(function (_ref) {
    var applyToAll = _ref.applyToAll,
        marketingCount = _ref.marketingCount;
    return markIneligible({
      query: query,
      applyToAll: applyToAll,
      expectedNumberObjectsModified: marketingCount,
      source: source
    }).then(_onSuccess(marketingCount), _onError).done();
  }, rethrowError).done();
}