'use es6';

import { List, Record } from 'immutable';
var TeamRecord = Record({
  id: undefined,
  name: '',
  userIds: List()
}, 'TeamRecord');

TeamRecord.fromJS = function (json) {
  if (json === null || json === undefined) {
    return json;
  }

  return TeamRecord(Object.assign({}, json, {
    userIds: json.userIds ? List(json.userIds) : List()
  }));
};

export default TeamRecord;