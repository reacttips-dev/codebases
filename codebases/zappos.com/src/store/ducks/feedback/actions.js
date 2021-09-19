import { FEEDBACK_LOOKUP_SURVEY_QUESTIONS, FEEDBACK_SAVE_QUESTION_RESPONSE } from 'store/ducks/feedback/types';
import { FEEDBACK_CLICK } from 'constants/reduxActions';

export const lookupSurveyQuestion = featureFeedback => ({ type: FEEDBACK_LOOKUP_SURVEY_QUESTIONS, ...featureFeedback });
export const onSaveSurveyQuestionResponse = ({ feedback, source }) => ({ type: FEEDBACK_SAVE_QUESTION_RESPONSE, feedback, source });
export const onFeedbackYesOrNoSelected = (isPositive, pageType, feedbackType) => ({ type: FEEDBACK_CLICK, feedback: isPositive, pageType, feedbackType });
