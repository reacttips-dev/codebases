'use es6';

import { CRM_OBJECT } from '../constants/dataTypes';
import { CRM_OBJECT_META_TYPE } from '../constants/crmObjectMetaTypes';
import { userInfo } from '../request/user-info';
export var isCustomObjectReport = function isCustomObjectReport(report) {
  return report.getIn(['config', 'dataType']) === CRM_OBJECT && report.getIn(['config', 'objectTypeId']).startsWith(CRM_OBJECT_META_TYPE.PORTAL_SPECIFIC + "-");
};
export var isCustomObjectType = function isCustomObjectType(dataType) {
  return dataType.startsWith(CRM_OBJECT_META_TYPE.PORTAL_SPECIFIC + "-");
};
export var isReportDowngradedCustomObject = function isReportDowngradedCustomObject(report) {
  return isCustomObjectReport(report) ? userInfo().then(function (info) {
    return !info.user.scopes.includes('custom-object-access');
  }) : Promise.resolve(false);
};