'use es6';

import { reduce } from '../../lib/async';
import { configure as metrics } from './metrics';
var mutators = [metrics];
export default (function (config) {
  return reduce(mutators, function (mutated, mutator) {
    return mutator(mutated);
  }, config);
});