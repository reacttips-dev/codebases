'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { isSupportedCrmObject } from '../../crmObjects/utils';
import * as http from '../../request/http';
export var isOnlySupportedViaBackendResolve = function isOnlySupportedViaBackendResolve(report) {
  return isSupportedCrmObject(report.getIn(['config', 'dataType']));
};
export var shouldUseBackendResolve = function shouldUseBackendResolve(report, gates, validationConfig) {
  var dataType = report.getIn(['config', 'dataType']);
  var migratingDataTypeMap = validationConfig.getIn(['migratingDataTypes']).toMap().mapEntries(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        v = _ref2[1];

    return [v.get('dataType'), v.get('gate')];
  });
  var isMigratedDataType = validationConfig.getIn(['migratedDataTypes']).some(function (migratedDataType) {
    return migratedDataType.get('dataType') === dataType;
  });
  return gates.includes(migratingDataTypeMap.get(dataType)) || isMigratedDataType;
};
export var isMigratedToBackendResolve = function isMigratedToBackendResolve(report, gates) {
  return http.get('reporting-validation/v1/validation/config').then(function (validationConfig) {
    return shouldUseBackendResolve(report, gates, validationConfig);
  });
};