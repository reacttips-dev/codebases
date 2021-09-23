'use es6';

import { reduce } from '../../lib/async';
import { configure as duration } from './duration';
var mutators = [duration];
export default (function (config) {
  return reduce(mutators, function (mutated, mutator) {
    return mutator(mutated);
  }, config);
});