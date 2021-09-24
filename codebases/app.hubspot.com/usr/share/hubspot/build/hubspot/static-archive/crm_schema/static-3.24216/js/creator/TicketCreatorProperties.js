'use es6';

import { Record } from 'immutable';
var TicketCreatorProperties = Record({
  associatedcompanyid: '',
  associatedcontactid: '',
  content: '',
  hs_conversations_originating_thread_id: null,
  // optional
  hubspot_owner_id: null,
  // optional
  source_type: '',
  subject: ''
}, 'TicketCreatorProperties');
export default TicketCreatorProperties;