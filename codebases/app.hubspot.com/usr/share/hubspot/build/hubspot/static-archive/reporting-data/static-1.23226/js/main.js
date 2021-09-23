'use es6';

import { Config } from './config';
import * as sandbox from './lib/sandbox';
import { userInfo } from './request/user-info';
import resolveFn from './resolve';
import { isMigratedToBackendResolve, isOnlySupportedViaBackendResolve } from './v2/reportingApi/isSupportedForBackendResolve';
import { reportingApiResolve } from './v2/reportingApi/resolve';
import { Exception } from './exceptions';
export var RUNTIME_OPTIONS = {
  batchRequests: false,
  v2Datasets: false,
  useBackendResolve: false,
  useLocalReportingApis: false,
  validationResolve: false
};
export var resolve = function resolve(report) {
  var runtimeOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  sandbox.register(report);
  var runtimeOptionsWithDefaults = Object.assign({
    report: report
  }, RUNTIME_OPTIONS, {}, runtimeOptions);

  if (isOnlySupportedViaBackendResolve(report) || runtimeOptions.useBackendResolve) {
    return reportingApiResolve(report, runtimeOptionsWithDefaults);
  }

  return userInfo().then(function (_ref) {
    var gates = _ref.gates;
    return isMigratedToBackendResolve(report, gates).then(function (shouldUseBackendResolve) {
      return shouldUseBackendResolve && runtimeOptionsWithDefaults.v2Datasets ? reportingApiResolve(report, runtimeOptionsWithDefaults) : resolveFn(Config(report.get('config')), runtimeOptionsWithDefaults);
    }).catch(function (error) {
      if (error instanceof Exception) throw error;
      return resolveFn(Config(report.get('config')), runtimeOptionsWithDefaults);
    });
  });
};
export var runtimeOptions = RUNTIME_OPTIONS;
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = module.exports;
}