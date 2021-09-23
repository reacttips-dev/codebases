'use es6';

import { Map as ImmutableMap } from 'immutable';
export var indexBy = function indexBy(indexer, data) {
  return ImmutableMap(data.map(function (datum) {
    return [indexer(datum), datum];
  }));
};