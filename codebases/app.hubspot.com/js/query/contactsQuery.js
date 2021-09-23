'use es6';

import { registerQuery } from 'data-fetching-client';
import { fetchContacts } from 'SequencesUI/api/ContactApi';
export var GET_CONTACTS = registerQuery({
  fieldName: 'contacts',
  args: ['vids'],
  fetcher: function fetcher(_ref) {
    var vids = _ref.vids;
    return fetchContacts(vids);
  }
});