import {
  FEEDBACK_STORE_SURVEY_QUESTION
} from 'store/ducks/feedback/types';

const defaultState = {};

export default function featureFeedback(state = defaultState, action = {}) {
  const {
    type,
    csrfToken,
    questionId,
    surveyId
  } = action;

  switch (type) {
    case FEEDBACK_STORE_SURVEY_QUESTION: {
      return { ...state, csrfToken, surveyId, questionId };
    }

    default: {
      return state;
    }
  }
}
