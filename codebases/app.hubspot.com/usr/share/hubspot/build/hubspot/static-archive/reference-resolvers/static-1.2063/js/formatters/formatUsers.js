'use es6';

import { formatOwnerLabel } from 'reference-resolvers/formatters/formatOwners';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import flattenN from 'transmute/flattenN';
import { List, fromJS } from 'immutable';

var formatUserId = function formatUserId(user) {
  return String(user.remoteId);
};

var formatUserReference = function formatUserReference(owner, remote) {
  return new ReferenceRecord({
    id: formatUserId(remote),
    label: formatOwnerLabel(owner),
    referencedObject: fromJS(remote)
  });
};

var formatUsers = function formatUsers(response) {
  var remotes = flattenN(1, List(response.map(function (owner) {
    return List(owner.remoteList.map(function (remote) {
      return formatUserReference(owner, remote);
    }));
  })));
  return indexBy(get('id'), remotes);
};

export default formatUsers;