'use es6';

import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import { Promise } from '../lib/promise';
import extractUniqueValues from '../dataset/extract-unique-values';
import { formatForScientificNotation } from '../v2/dataset/utils';
import { GLOBAL_NULL } from '../constants/defaultNullValues';
import { makeOption } from './Option';
export var adapt = function adapt(get) {
  return function (config, property, data, response, maybeExactIds) {
    var _ref = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {},
        _ref$excludeNull = _ref.excludeNull,
        excludeNull = _ref$excludeNull === void 0 ? false : _ref$excludeNull;

    var ids = (maybeExactIds || extractUniqueValues(property, data)).map(formatForScientificNotation);

    if (ids.isEmpty()) {
      return Promise.resolve(ImmutableMap({
        key: property,
        value: ImmutableMap()
      }));
    }

    if (excludeNull) {
      return get(ids.filter(function (id) {
        return id !== GLOBAL_NULL;
      })).then(function (options) {
        return ImmutableMap({
          key: property,
          value: options.set(GLOBAL_NULL, makeOption(GLOBAL_NULL, I18n.text('reporting-data.missing.value')))
        });
      });
    }

    return get(ids).then(function (options) {
      return ImmutableMap({
        key: property,
        value: options
      });
    });
  };
};