'use es6';

import * as collect from './collect';
import * as hydrate from './hydrate';
export var get = function get(spec, config, module) {
  var collectFn = collect.get(spec, config, module);
  var hydrateFn = hydrate.get(spec, config);
  return function (data) {
    return collectFn(data).then(function (dataWithReferences) {
      return hydrateFn(dataWithReferences);
    });
  };
};