'use es6';

import { reduce } from '../lib/async';
import { CONFIGURE } from '../constants/phases';
import { connectedPhase } from '../redux/resolve/connected';
import filters from './filters';
import bucket from './bucket';
import implicit from './implicit';
import dealstage from './dealstage';
import unified from './unified';
import conversion from './conversion';
import amount from './amount';
var mutators = [filters, bucket, implicit, dealstage, conversion, unified, amount];
export var configure = function configure(config) {
  return reduce(mutators, function (mutated, mutator) {
    return mutator(mutated);
  }, config);
};
export var configureReport = function configureReport(report) {
  return configure(report.get('config')).then(function (configuredConfig) {
    return report.set('config', configuredConfig);
  });
};
export var connectedConfigure = connectedPhase(CONFIGURE, configure);