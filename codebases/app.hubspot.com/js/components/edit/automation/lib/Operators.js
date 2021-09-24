'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _PageviewOperatorToPr, _PAGEVIEW_OPERATORS_L, _PAGEVIEW_OPERATORS_C;

export var Operators = {
  CONTAIN: 'CONTAINS',
  EQUAL: 'EQ'
};
export var PageviewOperators = {
  HAS_PAGEVIEW_EQUAL: 'HAS_PAGEVIEW_EQ',
  HAS_PAGEVIEW_CONTAINS: 'HAS_PAGEVIEW_CONTAINS'
};
export var PageviewOperatorToPropertyOperator = (_PageviewOperatorToPr = {}, _defineProperty(_PageviewOperatorToPr, PageviewOperators.HAS_PAGEVIEW_EQUAL, Operators.EQUAL), _defineProperty(_PageviewOperatorToPr, PageviewOperators.HAS_PAGEVIEW_CONTAINS, Operators.CONTAIN), _PageviewOperatorToPr);
export var ORDERED_PAGEVIEW_OPERATORS = [PageviewOperators.HAS_PAGEVIEW_EQUAL, PageviewOperators.HAS_PAGEVIEW_CONTAINS];
export var PAGEVIEW_OPERATORS_LABELS = (_PAGEVIEW_OPERATORS_L = {}, _defineProperty(_PAGEVIEW_OPERATORS_L, PageviewOperators.HAS_PAGEVIEW_EQUAL, 'sequencesAutomation.pageviewOperators.labels.HasPageviewEqual'), _defineProperty(_PAGEVIEW_OPERATORS_L, PageviewOperators.HAS_PAGEVIEW_CONTAINS, 'sequencesAutomation.pageviewOperators.labels.HasPageviewContain'), _PAGEVIEW_OPERATORS_L);
export var PAGEVIEW_OPERATORS_CELL_LABELS = (_PAGEVIEW_OPERATORS_C = {}, _defineProperty(_PAGEVIEW_OPERATORS_C, PageviewOperators.HAS_PAGEVIEW_EQUAL, 'sequencesAutomation.pageviewOperators.cellLabels.HasPageviewEqual'), _defineProperty(_PAGEVIEW_OPERATORS_C, PageviewOperators.HAS_PAGEVIEW_CONTAINS, 'sequencesAutomation.pageviewOperators.cellLabels.HasPageviewContain'), _PAGEVIEW_OPERATORS_C);