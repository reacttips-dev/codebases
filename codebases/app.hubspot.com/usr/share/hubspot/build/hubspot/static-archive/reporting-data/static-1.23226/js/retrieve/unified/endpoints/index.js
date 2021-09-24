'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as people from './people';
import * as dealsInfluenced from './dealsInfluenced';
import * as total from './total';
import * as breakdown from './breakdown';
import * as summarize from './summarize';
import * as points from './points';
/*
 * TODO
 * - check that dimension is a valid breakdown
 * - ensure 2d reports have datetime first dimension
 * - ensure 2d reports have filters applied
 * - assumes 1 metric, multi type is not possible
 */

export var get = function get(spec, config) {
  var dimensions = config.dimensions;

  switch (dimensions.length) {
    case 0:
      return total.get(spec, config);

    case 1:
      {
        var _dimensions = _slicedToArray(dimensions, 1),
            dimension = _dimensions[0];

        return dimension === 'sessionDate' ? summarize.get(spec, config) : dimension === 'people' ? people.get(spec, config) : dimension === 'deals-influenced' ? dealsInfluenced.get(spec, config) : breakdown.get(spec, config);
      }

    case 2:
      return points.get(spec, config);

    default:
      return null;
  }
};