'use es6';

import { List, Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
import CleanDomain from 'crm_data/utils/CleanDomain';
export default {
  byIds: function byIds(domains) {
    invariant(List.isList(domains), 'VisitsAPIQuery: expected domains to be a List but got %s', domains);
    domains = domains.map(CleanDomain);
    return ImmutableMap({
      domain: domains
    });
  }
};