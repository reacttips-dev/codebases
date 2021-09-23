'use es6';

import { List, Map as ImmutableMap, Record } from 'immutable';
import Status from '../../common-message-format/records/Status';
import { FEEDBACK_SURVEY } from '../constants/messageTypes';
var FeedbackSurveyMessage = Record({
  '@type': FEEDBACK_SURVEY,
  attachments: List(),
  feedbackTransactionId: null,
  id: null,
  messageDeletedStatus: null,
  recipients: List(),
  richText: null,
  sender: ImmutableMap(),
  senders: List(),
  status: Status(),
  surveyId: null,
  text: null
}, 'FeedbackSurveyMessage');
export default FeedbackSurveyMessage;