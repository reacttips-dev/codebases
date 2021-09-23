'use es6';

import { fromJS, List } from 'immutable';
import invariant from 'react-utils/invariant';
var defaultQuery = fromJS({
  property: []
});
export function byIds(engagementIds) {
  invariant(List.isList(engagementIds), 'EngagementsAPIQuery: expected engagementIds to be a List but got %s', engagementIds);
  return defaultQuery.merge({
    engagementId: engagementIds
  });
}