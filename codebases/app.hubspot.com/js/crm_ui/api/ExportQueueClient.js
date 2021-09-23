'use es6';

import http from 'hub-http/clients/apiClient';
import ExportActions from '../flux/export/ExportActions';
import HubHttpBaseClient from 'ExportDialog/apiClients/HubHttpBaseClient';
import { CrmLogger } from 'customer-data-tracking/loggers';
export var ViewsExportQueueClient = function ViewsExportQueueClient(options) {
  return Object.assign({}, HubHttpBaseClient, {
    export: function _export(args) {
      var opts = Object.assign({}, args, {}, options);
      var data = ExportActions.getInboundDbIoParams(opts);
      var exportedPropertiesNum = opts.includeAllColumns ? opts.properties && opts.properties.length : opts.view && opts.view.columns && opts.view.columns.size;
      CrmLogger.log('exportSavedView', {
        exportedPropertiesNum: exportedPropertiesNum,
        exportType: opts.includeAllColumns ? 'all columns' : 'selected columns',
        includesAdditionalEmails: options.includeAdditionalEmails,
        includesAdditionalDomains: options.includeAdditionalDomains,
        exportPageType: opts.exportPageType
      });
      return http.post("/inbounddb-io/exports", {
        data: data
      });
    }
  });
};