'use es6';

import { search } from './dao';
import { generate } from './generate';
import { transform } from './transform';
export default (function (spec, config) {
  return generate(config, spec.properties.idProperty).then(function (payload) {
    return search(spec.search.url, payload);
  }).then(function (response) {
    return transform(config, spec, response);
  });
});