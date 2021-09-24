'use es6';

import { fromJS, List, Map as ImmutableMap, Record } from 'immutable';
import { STANDARD } from './ViewTypes';
var ViewRecord = Record({
  ownerId: null,
  id: null,
  collectionType: null,
  name: null,
  columns: List(),
  state: ImmutableMap(),
  // `filters` and `filterGroups` are mututally exclusive
  filters: List(),
  filterGroups: List(),
  private: false,
  modified: false,
  teamId: null,
  type: STANDARD
}, 'ViewRecord');

ViewRecord.fromJS = function (json) {
  return ViewRecord(fromJS(json));
};

export default ViewRecord;