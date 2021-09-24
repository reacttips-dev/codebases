'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { FEEDBACK_SURVEY } from '../constants/messageTypes';
export var isFeedbackSurveyMessage = function isFeedbackSurveyMessage(message) {
  return getTopLevelType(message) === FEEDBACK_SURVEY;
};