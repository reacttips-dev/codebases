'use es6';

import { fromJS, List } from 'immutable';
import invariant from 'react-utils/invariant';
var defaultQuery = fromJS({
  id: [],
  ignoreDeletes: true,
  includeAllValues: true,
  // TODO: As soon as the index page is fully migtated to IKEA (table + board), we should remove this parameter.
  // See https://hubspot.slack.com/archives/C8Q99MGF4/p1605725036310700 for context
  associatedObjectFetch: true
});

var ensureList = function ensureList(list, name) {
  invariant(List.isList(list), "CompaniesAPIQuery: expected " + name + " to be a List but got %s", list);
};

export function byIds(companyIds) {
  ensureList(companyIds, 'companyIds');
  return defaultQuery.merge({
    id: companyIds
  });
}
export function byDomains(domains) {
  ensureList(domains, 'domains');
  return defaultQuery.merge({
    domain: domains
  });
}