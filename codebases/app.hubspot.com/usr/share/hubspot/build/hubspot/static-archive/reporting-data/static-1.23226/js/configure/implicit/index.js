'use es6';

import { reduce } from '../../lib/async';
import { configure as missing } from './missing';
import { configure as count } from './count';
var mutators = [missing, count];
export default (function (config) {
  return reduce(mutators, function (mutated, mutator) {
    return mutator(mutated);
  }, config);
});