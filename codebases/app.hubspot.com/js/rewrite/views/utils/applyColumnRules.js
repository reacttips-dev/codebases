'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import pluck from 'transmute/pluck';
import { unique } from '../../../utils/unique';
/* There are two rules we apply to columns:
 *
 * 1. The first column must be the primary display label
 * 2. The remaining columns must be filtered by isVisibleGridProperty
 */

export var applyColumnRules = function applyColumnRules(_ref) {
  var columns = _ref.columns,
      primaryDisplayLabelPropertyName = _ref.primaryDisplayLabelPropertyName,
      isVisibleGridColumnName = _ref.isVisibleGridColumnName;
  return unique([primaryDisplayLabelPropertyName].concat(_toConsumableArray(pluck('name', columns).filter(function (name) {
    return isVisibleGridColumnName(name);
  })))).map(function (name) {
    return {
      name: name
    };
  });
};