'use es6';

import { Record } from 'immutable';
var CompanyCreatorProperties = Record({
  name: '',
  hubspot_owner_id: null // optional

}, 'CompanyCreatorProperties');
export default CompanyCreatorProperties;