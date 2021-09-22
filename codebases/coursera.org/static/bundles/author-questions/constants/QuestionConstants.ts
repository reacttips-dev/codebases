/**
 * Constants representing server and view actions for Quiz authoring.
 */
const exported = {
  Actions: {
    SHOW_SAVE_NOTIFICATION: 'showSaveNotification',

    RECEIVE_COURSE_DATA: 'receiveCourseData',

    RECEIVE_ALL_QUESTIONS: 'receiveAllQuestions',
    RECEIVE_NEW_QUESTION: 'receiveNewQuestion',
    RECEIVE_QUESTION: 'receiveQuestion',
    RECEIVE_OPTION: 'receiveOption',

    RECEIVE_CODING_LANGUAGES: 'receiveCodingLanguages',
    RECEIVE_CODING_LANGUAGES_ERROR: 'receiveCodingLanguagesError',
    UPDATE_EVALUATOR_ID: 'updateEvaluatorId',
    UPDATE_STARTER_CODE: 'updateStarterCode',
    UPDATE_CODING_LANGUAGE: 'updateCodeLanguage',
    UNEXPECTED_CODING_LANGUAGE: 'unexpectedCodingLanguage',

    RECEIVED_WIDGET: 'receiveWidget',
    RECEIVED_WIDGETS_LIST: 'receiveWidgetsList',
    UPDATE_WIDGET: 'updateWidget',
    UPDATE_WIDGET_QUESTION_PROVIDER_ID: 'updateWidgetQuestionProviderId',

    ADD_QUESTION: 'addQuestion',
    REMOVE_QUESTION: 'removeQuestion',
    UPDATE_QUESTION: 'updateQuestion',
    UPDATE_QUESTION_TITLE: 'updateQuestionTitle',
    UPDATE_QUESTION_TYPE: 'updateQuestionType',
    UPDATE_QUESTION_INCORRECT_FEEDBACK: 'updateQuestionIncorrectFeedback',
    UPDATE_QUESTION_FEEDBACK: 'updateQuestionFeedback',

    EDIT_QUESTION: 'editQuestion',
    PREVIEW_QUESTION: 'previewQuestion',

    UPDATE_OPTION_DISPLAY: 'updateOptionDisplay',
    UPDATE_OPTION_FEEDBACK: 'updateOptionFeedback',
    UPDATE_OPTION_SELECTION: 'updateOptionSelection',
    UPDATE_OPTION_SHUFFLING: 'updateOptionShuffling',
    UPDATE_OPTION_PARTIAL_SCORING: 'updateAllowPartialScoring',

    UPDATE_NUMERIC_INTERVAL: 'updateNumericInterval',
    UPDATE_NUMERIC_OPTION_FEEDBACK: 'updateNumericOptionFeedback',

    UPDATE_REGEX_VALUE: 'updateRegexValue',

    RECEIVE_CONFLICT: 'receiveConflict',

    REVERTED_QUESTIONS: 'revertedQuestions',

    ADD_OPTION: 'addOption',
    REMOVE_OPTION: 'removeOption',
    REORDER_OPTION: 'reorderOption',

    UNLOAD: 'unload',
  },
};

export default exported;

export const { Actions } = exported;
