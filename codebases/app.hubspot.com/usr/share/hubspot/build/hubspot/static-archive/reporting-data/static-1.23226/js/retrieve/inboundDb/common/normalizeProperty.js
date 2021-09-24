'use es6';

import normalize from './normalize';
var PROPERTIES_TO_NORMALIZE = ['engagement_hs_note_body', 'engagement_hs_call_body', 'engagement_hs_meeting_body', 'engagement_hs_email_html', 'engagement_hs_task_body'];
export default (function (key, property) {
  return PROPERTIES_TO_NORMALIZE.includes(property) ? normalize(key) : key;
});