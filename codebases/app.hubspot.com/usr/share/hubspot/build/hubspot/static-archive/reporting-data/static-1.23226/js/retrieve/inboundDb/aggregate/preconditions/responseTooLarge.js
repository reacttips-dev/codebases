'use es6';

import _toArray from "@babel/runtime/helpers/esm/toArray";
import { Map as ImmutableMap, List } from 'immutable';
import { TooMuchDataException } from '../../../../exceptions';
export var DEFAULT_LIMIT = 500;

var precondition = function precondition(response) {
  var limits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [DEFAULT_LIMIT];

  var check = function check(data) {
    return data.get('aggregations', ImmutableMap()).forEach(function (aggregation) {
      var _limits = _toArray(limits),
          _limits$ = _limits[0],
          limit = _limits$ === void 0 ? DEFAULT_LIMIT : _limits$,
          rest = _limits.slice(1);

      if (aggregation.count() > limit) {
        throw new TooMuchDataException();
      }

      precondition(aggregation, rest);
    });
  };

  if (List.isList(response)) {
    response.forEach(check);
  } else {
    check(response);
  }
};

export default precondition;