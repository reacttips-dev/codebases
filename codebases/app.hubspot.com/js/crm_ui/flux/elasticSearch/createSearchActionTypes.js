'use es6';

import * as MakeActions from 'crm_data/actions/MakeActions';
import * as ActionVerbs from 'crm_data/actions/ActionVerbs';
export default function (namespace) {
  return Object.assign(MakeActions.makeAsyncActionTypes(namespace, ActionVerbs.FETCH), {
    MOVED: namespace + "_RESULT_MOVED",
    EXPIRED: namespace + "_RESULT_EXPIRED",
    VIEW_UPDATED: namespace + "_VIEW_UPDATED"
  });
}