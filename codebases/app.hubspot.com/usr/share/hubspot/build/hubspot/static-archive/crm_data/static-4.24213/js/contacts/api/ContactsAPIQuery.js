'use es6';

import { fromJS, List } from 'immutable';
import invariant from 'react-utils/invariant';
var DEFAULT_QUERY = fromJS({
  property: []
});
export function byIds(contactIds) {
  invariant(List.isList(contactIds), 'ContactsAPIQuery: expected contactIds to be a List but got %s', contactIds);
  return DEFAULT_QUERY.merge({
    vid: contactIds
  });
}