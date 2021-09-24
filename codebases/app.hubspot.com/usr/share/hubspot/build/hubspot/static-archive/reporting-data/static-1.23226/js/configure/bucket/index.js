'use es6';

import { reduce } from '../../lib/async';
import { configure as created } from './created';
import { configure as dealprogress } from './dealprogress';
import { configure as lifecyclestage } from './lifecyclestage';
var mutators = [created, dealprogress, lifecyclestage];
export default (function (config) {
  return reduce(mutators, function (mutated, mutator) {
    return mutator(mutated);
  }, config);
});