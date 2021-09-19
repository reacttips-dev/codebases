/**
 * Get the number of Ask questions from the ask object in the state
 *
 * @param askState       state.ask
 * @param valueIfNoData  the value to return if the data is loading or missing
 *                       (defaults to 0)
 */
export const getNumberOfAskQuestions = (askState, valueIfNoData = 0) => {
  if (!askState || askState.loading) {
    return valueIfNoData;
  }
  const { data } = askState;
  if (!data) {
    return valueIfNoData;
  }
  const { questions } = data;
  return questions ? questions.length : valueIfNoData;
};

/**
 * Format Ask params for `trackEvent` (Zappalytics events)
 *
 * @param productId  optional string  the ID of the product
 *
 * @param [itemId]     optional string  the ID of the ask item
 *
 * @param [isAnswer]   optional string  true if the given item is an answer (and
 *                                    not a question)
 *
 * @returns          string           the second argument to `trackEvent`
 */
export const formatAskTrackEventParams = (productId, itemId, isAnswer) => {
  let parts = [];
  if (productId) {
    parts = parts.concat(['ProductID', productId]);
  }
  if (itemId) {
    parts = parts.concat([isAnswer ? 'AnswerID' : 'QuestionID', itemId]);
  }
  return parts.join(':');
};

/** Shorthand for formatAskTrackEventParams(productId, itemId, false) */
export const formatAskQuestionTrackEventParams = (productId, questionId) => (
  formatAskTrackEventParams(productId, questionId, false)
);

/** Shorthand for formatAskTrackEventParams(productId, itemId, true) */
export const formatAskAnswerTrackEventParams = (productId, answerId) => (
  formatAskTrackEventParams(productId, answerId, true)
);
