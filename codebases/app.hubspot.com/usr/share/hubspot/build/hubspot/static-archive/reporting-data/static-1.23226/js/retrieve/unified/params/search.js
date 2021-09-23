'use es6';

import { create } from './strings';
export var get = function get(spec, config) {
  var dimensions = config.dimensions || [];

  if (dimensions.includes('people')) {
    return {};
  }

  return create('search').get(spec, config);
};