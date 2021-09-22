import $ from 'jquery';

const getQuestionAuthoringData = function (inVideoQuestionAuthoringData: $TSFixMe) {
  const questionAuthoringData = $.extend(true, {}, inVideoQuestionAuthoringData);

  if (questionAuthoringData.draft) {
    questionAuthoringData.draft = { question: questionAuthoringData.draft };
  }

  questionAuthoringData.published = {
    question: questionAuthoringData.published,
  };

  return questionAuthoringData;
};

const exported = {
  getQuestionAuthoringData,
};

export default exported;
export { getQuestionAuthoringData };
