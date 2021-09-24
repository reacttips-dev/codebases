'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { objectEntries } from '../../objectUtils/objectEntries';
import { DenormalizedPropertyFilterQueryParamMapping } from '../constants/QueryParamsThatRequireParsing'; // HACK: Some older links pass a "-" in place of the "." that CrmSearch actually expects
// for these properties. Until we can change all places generating these links, we'll
// have to handle them just like the old code did.

export var normalizeQueryParams = function normalizeQueryParams(rawParams) {
  return objectEntries(DenormalizedPropertyFilterQueryParamMapping).reduce(function (normalizedParams, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        denormalizedKey = _ref2[0],
        normalizedKey = _ref2[1];

    if (rawParams[denormalizedKey]) {
      normalizedParams[normalizedKey] = rawParams[denormalizedKey];
      delete normalizedParams[denormalizedKey];
    }

    return normalizedParams;
  }, Object.assign({}, rawParams));
};