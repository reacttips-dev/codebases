'use es6';

import invariant from '../../../lib/invariant';
import getRequestGenerator from './generators';
export default (function (config, properties, runtimeOptions) {
  return Promise.resolve(getRequestGenerator(config)).then(function (requestGenerator) {
    invariant(requestGenerator, 'expected requestGenerator but no matches were found for %s', config);
    return requestGenerator(config, properties, runtimeOptions);
  });
});