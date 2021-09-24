'use es6';

import VisitsAPI from 'crm_data/prospects/VisitsAPI';
import VisitsAPIQuery from 'crm_data/prospects/VisitsAPIQuery';
import dispatcher from 'dispatcher/dispatcher';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
import compose from 'transmute/compose';
var fetch = VisitsAPI.fetch;
var byIds = VisitsAPIQuery.byIds;
var PREFIX = 'VISITS';
registerPooledObjectService({
  actionTypePrefix: PREFIX,
  fetcher: compose(fetch, byIds)
});
var VisitsStore = definePooledObjectStore({
  actionTypePrefix: PREFIX
}).register(dispatcher);
export default VisitsStore;