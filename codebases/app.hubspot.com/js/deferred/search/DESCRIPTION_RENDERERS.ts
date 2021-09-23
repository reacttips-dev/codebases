import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Object$assign;

import renderDate from './renderDate';
import renderTask from './renderTask';
import arrayOptionsContact from './arrayOptionsContact';
import activityBody from './activityBody';
import defaultHighlightObject from './defaultHighlightObject';
import RESULT_TYPES from './const/RESULT_TYPES';
import customObjectBody from './customObjectBody';
export default Object.assign({}, defaultHighlightObject('description'), (_Object$assign = {}, _defineProperty(_Object$assign, RESULT_TYPES.DEAL, renderDate), _defineProperty(_Object$assign, RESULT_TYPES.TASK, renderTask), _defineProperty(_Object$assign, RESULT_TYPES.ACTIVITY, activityBody), _defineProperty(_Object$assign, RESULT_TYPES.CONTACT, arrayOptionsContact), _defineProperty(_Object$assign, RESULT_TYPES.CUSTOM_OBJECT, customObjectBody), _defineProperty(_Object$assign, RESULT_TYPES.COMPANY, 'domain'), _defineProperty(_Object$assign, RESULT_TYPES.EMAIL, 'subject'), _defineProperty(_Object$assign, RESULT_TYPES.LEARNING_CENTER_LESSON, 'teaser'), _defineProperty(_Object$assign, RESULT_TYPES.BLOG_POST, 'absoluteUrl'), _defineProperty(_Object$assign, RESULT_TYPES.LANDING_PAGE, 'absoluteUrl'), _defineProperty(_Object$assign, RESULT_TYPES.SITE_PAGE, 'absoluteUrl'), _defineProperty(_Object$assign, RESULT_TYPES.TRANSCRIPT, 'content'), _Object$assign));