import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Object$assign;

import contactHeadline from './contactHeadline';
import activityHeadline from './activityHeadline';
import transcriptHeadline from './transcriptHeadline';
import customObjectHeadline from './customObjectHeadline';
import RESULT_TYPES from './const/RESULT_TYPES';
import defaultHighlightObject from './defaultHighlightObject';
export default Object.assign({}, defaultHighlightObject(), (_Object$assign = {}, _defineProperty(_Object$assign, RESULT_TYPES.ACTIVITY, activityHeadline), _defineProperty(_Object$assign, RESULT_TYPES.CONTACT, contactHeadline), _defineProperty(_Object$assign, RESULT_TYPES.TASK, 'taskSubject'), _defineProperty(_Object$assign, RESULT_TYPES.TRANSCRIPT, transcriptHeadline), _defineProperty(_Object$assign, RESULT_TYPES.CUSTOM_OBJECT, customObjectHeadline), _Object$assign));