'use es6';

import { List, Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import { stringify } from 'hub-http/helpers/params';
var TICKET_ID_KEY = 'id';
export function byIds(ticketIds) {
  invariant(List.isList(ticketIds), 'TicketsAPIQuery: expected ticketIds to be a List but got %s', ticketIds);
  return ImmutableMap().set(TICKET_ID_KEY, ticketIds);
}
export function byIdsStr(ticketIds) {
  return stringify(byIds(ticketIds).toJS());
}