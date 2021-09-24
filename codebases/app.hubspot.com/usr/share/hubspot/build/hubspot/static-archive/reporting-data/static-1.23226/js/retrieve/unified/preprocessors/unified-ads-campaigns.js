'use es6';

import * as sorting from './sort';
import * as paging from './page';
export var preprocess = function preprocess(spec, config) {
  return function (response) {
    var sort = sorting.get(spec, config);
    var page = paging.get(spec, config);
    return page(sort(response));
  };
};