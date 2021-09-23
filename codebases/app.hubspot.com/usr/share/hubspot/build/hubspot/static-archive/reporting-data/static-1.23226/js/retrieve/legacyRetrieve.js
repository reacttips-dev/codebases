'use es6';

import { ANALYTICS_FUNNEL } from '../constants/dataTypes';
import rethrow from '../lib/rethrow';
import { load } from '../dataTypeDefinitions';
import getProperties from '../properties';
import * as http from '../request/http';
import { summarize } from '../dataset/summarize';
export // NOTE: Check that module has been registered, otherwise log error
var retrieve = function retrieve(dataConfig, debug) {
  var runtimeOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _runtimeOptions$batch = runtimeOptions.batchRequests,
      batchRequests = _runtimeOptions$batch === void 0 ? false : _runtimeOptions$batch;
  var dataType = dataConfig.get('dataType');
  return load(dataType).then(function (module) {
    var api = module.get('use');

    if (dataType === ANALYTICS_FUNNEL) {
      return api(dataConfig).then(function (dataset) {
        return {
          dataConfig: dataConfig,
          dataset: dataset,
          response: undefined
        };
      });
    }

    return getProperties(dataType).then(function (properties) {
      return api(dataConfig, properties, runtimeOptions);
    }).then(function (request) {
      debug('request', request);
      return http.retrieve(request, {
        batchRequests: batchRequests
      }).catch(function (err) {
        return module.get('handleError') ? module.get('handleError')(dataConfig, err) : rethrow(err);
      }).then(function (response) {
        debug('response', response);
        var transformed = request.transformer ? request.transformer(dataConfig, response) : response;
        return Promise.resolve(transformed).then(function (dataset) {
          return {
            response: response,
            dataset: summarize(dataset)
          };
        });
      });
    }).then(function (_ref) {
      var dataset = _ref.dataset,
          response = _ref.response;
      return {
        dataConfig: dataConfig,
        dataset: dataset,
        response: response
      };
    }).catch(rethrow);
  });
};
export var match = function match() {
  return true;
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = module.exports;
}