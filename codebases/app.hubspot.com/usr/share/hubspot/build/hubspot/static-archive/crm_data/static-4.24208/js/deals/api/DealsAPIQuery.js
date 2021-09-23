'use es6';

import { List, Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import { stringify } from 'hub-http/helpers/params';
var DEAL_ID_KEY = 'dealId';
export function byIds(dealIds) {
  invariant(List.isList(dealIds), 'DealsAPIQuery: expected dealIds to be a List but got %s', dealIds);
  return ImmutableMap().set(DEAL_ID_KEY, dealIds);
}
export function byIdsStr(dealIds) {
  return stringify(byIds(dealIds).toJS());
}