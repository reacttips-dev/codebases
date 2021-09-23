'use es6';

import get from 'transmute/get';
import * as Identifiable from '../protocol/Identifiable';
import { fromJS, List, Record } from 'immutable';
var OwnerRecord = Record({
  createdAt: 0,
  email: undefined,
  firstName: undefined,
  lastName: undefined,
  ownerId: undefined,
  portalId: undefined,
  quota: 0,
  remoteList: List(),
  type: undefined,
  updatedAt: 0,
  signature: undefined,
  activeUserId: undefined,
  activeSalesforceId: undefined,
  // Extras
  active: false
}, 'OwnerRecord');
Identifiable.getId.implement(OwnerRecord, get('ownerId'));

var getActive = function getActive(owner) {
  return Boolean(owner.activeSalesforceId || owner.activeUserId);
};

OwnerRecord.fromJS = function (json) {
  var active = getActive(json);
  return OwnerRecord(Object.assign({}, json, {
    active: active,
    remoteList: json.remoteList ? fromJS(json.remoteList) : List()
  }));
};

export default OwnerRecord;