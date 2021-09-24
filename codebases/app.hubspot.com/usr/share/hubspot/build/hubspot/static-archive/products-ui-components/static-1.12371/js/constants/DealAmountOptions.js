'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _MARGIN_PROPERTIES;

import keyMirror from 'react-utils/keyMirror';
import { TCV, TCV_MARGIN, ACV, ACV_MARGIN, MRR, MRR_MARGIN, ARR, ARR_MARGIN } from 'customer-data-objects/lineItem/PropertyNames';
export var DEAL_AMOUNT_OPTIONS = keyMirror({
  TCV: null,
  ACV: null,
  ARR: null,
  MRR: null,
  CUSTOM: null
});
export var DEAL_AMOUNT_PREFERENCES = keyMirror({
  hs_tcv: null,
  hs_acv: null,
  hs_arr: null,
  hs_mrr: null,
  legacy: null,
  disabled: null
});
export var MARGIN_PROPERTIES = (_MARGIN_PROPERTIES = {}, _defineProperty(_MARGIN_PROPERTIES, TCV, TCV_MARGIN), _defineProperty(_MARGIN_PROPERTIES, ACV, ACV_MARGIN), _defineProperty(_MARGIN_PROPERTIES, MRR, MRR_MARGIN), _defineProperty(_MARGIN_PROPERTIES, ARR, ARR_MARGIN), _MARGIN_PROPERTIES);
export var NOT_APPLICABLE = 'NOT_APPLICABLE';