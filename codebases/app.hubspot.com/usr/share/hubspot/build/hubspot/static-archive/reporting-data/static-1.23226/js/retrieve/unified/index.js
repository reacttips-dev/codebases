'use es6';

import { fromJS } from 'immutable';
import toJS from '../../lib/toJS';
import { load } from '../../dataTypeDefinitions';
import * as http from '../../request/http';
import Request from '../../request/Request';
import * as endpoints from './endpoints';
import * as hybrid from './hybrid';
import * as labels from './labels';
import * as params from './params';
import * as preconditions from './preconditions';
import * as preprocessors from './preprocessors';
import { summarize } from '../../dataset/summarize';
export default (function (immutableConfig, debug) {
  var config = toJS(immutableConfig);
  var dataType = config.dataType;
  return load(dataType).then(function (module) {
    var spec = module.getUnifiedSpecForConfig(config);
    var param = params.get(spec, config);
    var preprocessor = preprocessors.get(spec, config);
    var precondition = preconditions.get(spec, config);

    var _endpoints$get = endpoints.get(spec, config),
        url = _endpoints$get.url,
        parse = _endpoints$get.parse,
        downgrade = _endpoints$get.downgrade;

    var _hybrid$get = hybrid.get(spec, config),
        method = _hybrid$get.method,
        data = _hybrid$get.data;

    var hydrate = labels.get(spec, config, module);
    var request = Request.instance({
      url: url,
      method: method,
      data: data,
      query: param
    });
    debug('request', request);
    return http.retrieve(request).then(function (response) {
      debug('response', response);
      return response;
    }).then(toJS).then(preprocessor).then(precondition).then(parse).then(hydrate).then(downgrade).then(fromJS).then(summarize).then(function (nested) {
      return {
        dataConfig: immutableConfig,
        dataset: nested,
        response: null
      };
    });
  });
});