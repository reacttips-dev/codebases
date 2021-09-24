'use es6';

import { SEARCH } from '../../constants/configTypes';
import rethrow from '../../lib/rethrow';
import getProperties from '../../properties';
import * as http from '../../request/http';
import aggregate from './aggregate';
import search from './search';
export default (function (config, debug, runtimeOptions) {
  var _runtimeOptions$batch = runtimeOptions.batchRequests,
      batchRequests = _runtimeOptions$batch === void 0 ? false : _runtimeOptions$batch;
  var dataType = config.get('dataType'); // search

  if (config.get('configType') === SEARCH) {
    return search(config, runtimeOptions);
  } // aggregate


  return getProperties(dataType).then(function (properties) {
    return aggregate(config, properties, runtimeOptions);
  }).then(function (request) {
    debug('request', request);
    return http.retrieve(request, {
      batchRequests: batchRequests
    }).catch(function (err) {
      return rethrow(err);
    }).then(function (response) {
      debug('response', response);
      var transformed = request.transformer ? request.transformer(config, response) : response;
      return Promise.resolve(transformed).then(function (dataset) {
        return {
          response: response,
          dataset: dataset
        };
      });
    });
  }).then(function (_ref) {
    var dataset = _ref.dataset,
        response = _ref.response;
    return {
      dataConfig: config,
      dataset: dataset,
      response: response
    };
  });
});