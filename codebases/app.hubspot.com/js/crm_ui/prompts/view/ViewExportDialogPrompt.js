'use es6';

import ViewExportDialog from '../../dialog/view/ViewExportDialog';
import Promptable from 'UIComponents/decorators/Promptable';
import ScopesContainer from '../../../containers/ScopesContainer';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import PortalIdParser from 'PortalIdParser';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { doFailureAlert, doDuplicateAlert } from '../../../rewrite/views/components/ViewExportDialogWrapper';

var _prompt = Promptable(ViewExportDialog);

var _getSuccessMessage = function _getSuccessMessage() {
  var scopes = ScopesContainer.get();

  if (scopes['hub-marketing-product']) {
    return 'filterSidebar.exportView.successNotificationWithExportAuditLink';
  } else {
    return 'filterSidebar.exportView.successBasicWithExportAuditLink';
  }
};

var _showSuccessMessage = function _showSuccessMessage() {
  return Alerts.addSuccess(_getSuccessMessage(), {
    exportAuditLink: "/sales-products-settings/" + PortalIdParser.get() + "/importexport"
  }, {
    sticky: true
  });
};

var _showGenericError = function _showGenericError(error, xhr) {
  if (xhr.status === 409) {
    doDuplicateAlert();
  } else {
    doFailureAlert();
  }
};

var ViewExportDialogPrompt = function ViewExportDialogPrompt(options) {
  var opts = {
    exportPageType: options.exportPageType,
    ownerEmail: options.userEmail,
    objectType: options.objectType,
    options: options,
    onSuccess: _showSuccessMessage,
    onDuplicate: doDuplicateAlert,
    onFailure: _showGenericError
  };
  return _prompt(opts).then(function () {}, rethrowError).done();
};

export default ViewExportDialogPrompt;