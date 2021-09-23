'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _INIT$SELECT_ITEM;

import { trackSalesModalIndexInteraction, initTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import { INIT, SELECT_ITEM } from './actionTypes';
export default (_INIT$SELECT_ITEM = {}, _defineProperty(_INIT$SELECT_ITEM, INIT, initTracker()), _defineProperty(_INIT$SELECT_ITEM, SELECT_ITEM, function (action) {
  trackSalesModalIndexInteraction(action.payload.contentType, 'insert-item');
}), _INIT$SELECT_ITEM);