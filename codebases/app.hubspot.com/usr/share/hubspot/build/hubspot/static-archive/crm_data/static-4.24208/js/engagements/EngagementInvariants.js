'use es6';

import { Map as ImmutableMap, Iterable } from 'immutable';
import invariant from 'react-utils/invariant';
import isNumber from 'transmute/isNumber';
import EngagementRecord from 'customer-data-objects/engagement/EngagementRecord';
export function engagementIdInvariant(engagementId) {
  return invariant(isNumber(engagementId), 'EngagementActions: expected engagementId to be a number but got "%s" ', typeof engagementId);
}
export function engagementIdsInvariant(engagementIds) {
  return invariant(Iterable.isIterable(engagementIds), 'EngagementsActions: expected engagementIds to be a List or Set but got "%s"');
}
export function engagementsInvariant(engagements) {
  return invariant(ImmutableMap.isMap(engagements), 'EngagementsActions: expected engagements to be a Map but got "%s"');
}
export function engagementRecordInvariant(engagement) {
  return invariant(engagement instanceof EngagementRecord, 'EngagementsActions: expected engagement to be an EngagementRecord but got "%s"');
}
export function engagementUpdatesInvariant(updates) {
  return invariant(ImmutableMap.isMap(updates), 'EngagementsActions: expected engagement updates to be a Map but got "%s"');
}