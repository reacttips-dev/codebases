import { call, put, select, takeEvery } from 'redux-saga/effects';

import { FEEDBACK_LOOKUP_SURVEY_QUESTIONS, FEEDBACK_SAVE_QUESTION_RESPONSE, FEEDBACK_STORE_SURVEY_QUESTION } from 'store/ducks/feedback/types';
import { getSurveyQuestions, saveSurveyQuestionResponse } from 'apis/mafia';
import { getFeedback, getMafiaAndCredentials } from 'store/ducks/readFromStore';
import { trackError } from 'helpers/ErrorUtils';

export function* watchLookupSurveyQuestion() {
  yield takeEvery(FEEDBACK_LOOKUP_SURVEY_QUESTIONS, workLookupSurveyQuestion);
}

export function* watchSaveSurveyQuestionResponse() {
  yield takeEvery(FEEDBACK_SAVE_QUESTION_RESPONSE, workSaveSurveyQuestionResponse);
}

export function* workLookupSurveyQuestion({ surveyName, questionText, questionType }) {
  try {
    const { mafia } = yield select(getMafiaAndCredentials);
    const response = yield call(getSurveyQuestions, mafia, surveyName);
    const { csrf_token: csrfToken, questions, survey_id: surveyId } = response;
    const question = (questions || []).find(
      item => item.type === questionType && item.content && item.content.includes(questionText)) || null;
    const { id: questionId } = question || {};
    yield put({ type: FEEDBACK_STORE_SURVEY_QUESTION, csrfToken, surveyId, questionId });
  } catch (error) {
    yield call(trackError, 'NON-FATAL', 'Could not determine if voc freeform textfield exists', error);
  }
}

export function* workSaveSurveyQuestionResponse({ feedback, source }) {
  try {
    const { mafia, credentials } = yield select(getMafiaAndCredentials);
    const { csrfToken, questionId, surveyId } = yield select(getFeedback);
    yield call(saveSurveyQuestionResponse, mafia, { csrfToken, feedback, questionId, source, surveyId }, credentials);
  } catch (error) {
    yield call(trackError, 'NON-FATAL', 'Unable to save VOC free form text field', error);
  }
}

export default [
  watchLookupSurveyQuestion,
  watchSaveSurveyQuestionResponse
];
