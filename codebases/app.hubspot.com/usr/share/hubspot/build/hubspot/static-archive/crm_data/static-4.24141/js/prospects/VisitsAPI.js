'use es6';

import reduce from 'transmute/reduce';
import VisitRecord from 'customer-data-objects/visit/VisitRecord';
import { Map as ImmutableMap } from 'immutable';
import { get } from 'crm_data/api/ImmutableAPI';
import { getId } from 'customer-data-objects/model/ImmutableModel';
var URI = 'companyprospects/v1/prospects/batch';
export default {
  fetch: function fetch(query) {
    return get(URI, query, function (result) {
      return reduce(ImmutableMap(), function (coll, val) {
        if (val && val.prospect) {
          var record = VisitRecord.fromJS(val.prospect);
          coll = coll.set(getId(record), record);
        }

        return coll;
      }, result);
    });
  }
};