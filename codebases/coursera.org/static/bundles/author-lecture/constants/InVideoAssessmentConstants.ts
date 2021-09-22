const InVideoAssessmentActions = {
  EDIT_IN_VIDEO_QUESTION: 'editInVideoQuestion',
  DELETE_QUESTION: 'deleteQuestion',
  RECEIVE_IN_VIDEO_ASSESSMENT: 'receieveInVideoAssessment',

  UPDATE_CUEPOINTMS: 'updateCuePointMs',
  UPDATE_ORDER: 'updateOrder',

  CREATE_QUESTION: 'createQuestion',
  UPDATE_QUESTION: 'updateQuestion',

  CREATE_CUEPOINTMS: 'createCuepointMs',
};

const InVideoAssessmentState = {
  None: 'none',
  Published: 'published',
  Draft: 'draft',
};

const exported = {
  InVideoAssessmentActions,
  InVideoAssessmentState,
};

export default exported;
export { InVideoAssessmentActions, InVideoAssessmentState };
