import API from 'js/lib/api';

// @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
const feedbackAdminAPI = new API('/api/feedbackAdmin.v1', {
  type: 'rest',
});

export default feedbackAdminAPI;
