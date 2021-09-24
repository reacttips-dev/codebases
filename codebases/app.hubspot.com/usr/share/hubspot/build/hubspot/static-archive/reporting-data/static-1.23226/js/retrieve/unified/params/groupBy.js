'use es6';

import { has } from '../../../lib/has';
export var get = function get(spec, config) {
  var _spec$metadata = spec.metadata,
      metadata = _spec$metadata === void 0 ? {} : _spec$metadata;
  var dimensions = config.dimensions;

  if (dimensions.length === 1 && has(metadata, dimensions[0])) {
    return {
      groupby: "metadata-" + dimensions[0]
    };
  }

  return {};
};