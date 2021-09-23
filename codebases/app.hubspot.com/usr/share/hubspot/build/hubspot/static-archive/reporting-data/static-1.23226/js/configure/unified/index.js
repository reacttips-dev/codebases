'use es6';

import { reduce } from '../../lib/async';
import * as overrides from '../../lib/overrides';
import { configure as feedback } from './feedback';
import { configure as campaigns } from './analytics-campaigns';
import { configure as configureFilters } from './configure-filters';
var optional = [];
var required = [feedback, campaigns, configureFilters];
export default (function (config) {
  var mutators = overrides.unified.enabled ? [].concat(optional, required) : required;
  return reduce(mutators, function (mutated, mutator) {
    return mutator(mutated);
  }, config);
});