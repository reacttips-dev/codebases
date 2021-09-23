'use es6';

import * as defaultParams from './defaultParams';
import * as dates from './dates';
import * as sort from './sort';
import * as limit from './limit';
import * as offset from './offset';
import * as filters from './filters';
import * as excludes from './excludes';
import * as search from './search';
import * as drilldowns from './drilldowns';
import * as defined from './defined';
import * as metadata from './metadata';
import * as metricFilters from './metricFilters';
import * as groupBy from './groupBy';
export var get = function get(spec, config) {
  return Object.assign({}, defaultParams.get(spec, config), {}, dates.get(spec, config), {}, sort.get(spec, config), {}, limit.get(spec, config), {}, offset.get(spec, config), {}, filters.get(spec, config), {}, excludes.get(spec, config), {}, search.get(spec, config), {}, drilldowns.get(spec, config), {}, defined.get(spec, config), {}, metadata.get(spec, config), {}, metricFilters.get(spec, config), {}, groupBy.get(spec, config));
};