'use es6';

import { Record } from 'immutable';
var ContactCreatorProperties = Record({
  firstname: '',
  lastname: '',
  email: '',
  hubspot_owner_id: null // optional

}, 'ContactCreatorProperties');
export default ContactCreatorProperties;