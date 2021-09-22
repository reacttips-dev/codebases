import API from 'js/lib/api';

// @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
const myFeedbackAPI = new API('/api/myFeedback.v1', {
  type: 'rest',
});

export default myFeedbackAPI;
