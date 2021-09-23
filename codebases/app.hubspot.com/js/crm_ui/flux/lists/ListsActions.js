'use es6';

import { CONTACTS_REMOVED_FROM_LIST, CONTACTS_UPDATED, CONTACT_SET, LISTS_FETCH_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { transact } from 'crm_data/flux/transact';
import { fetch as ListsAPI_fetch, addToList as ListsAPI_addToList, removeFromList as ListsAPI_removeFromList, bulkRemoveFromList as ListsAPI_bulkRemoveFromList } from 'crm_data/lists/ListsAPI';
import { getId, getProperty } from 'customer-data-objects/model/ImmutableModel';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import { Map as ImmutableMap } from 'immutable';

var notifyAddToListSuccess = function notifyAddToListSuccess(contact, restrictedContentObjects) {
  if (restrictedContentObjects > 0) {
    Alerts.addSuccess('restrictedContent.addedToList.message', {
      name: formatName({
        firstName: getProperty(contact, 'firstname'),
        lastName: getProperty(contact, 'lastname')
      }),
      count: restrictedContentObjects
    }, {
      titleText: I18n.text('restrictedContent.addedToList.title')
    });
  }

  Alerts.addSuccess('listActions.addedToListSuccess');
};

var notifyAddToListError = function notifyAddToListError() {
  Alerts.addError('listActions.addedToListError');
};

var notifyRemoveFromListSuccess = function notifyRemoveFromListSuccess() {
  Alerts.addSuccess('listActions.removedFromListSuccess');
};

var notifyRemoveFromListError = function notifyRemoveFromListError() {
  Alerts.addError('listActions.removedFromListError');
};

export function fetch(listIds) {
  return ListsAPI_fetch(listIds).then(function (lists) {
    return dispatchQueue(LISTS_FETCH_SUCCEEDED, lists);
  });
}
export function addToList(contact, listId, restrictedContentObjects) {
  var vid = getId(contact);
  var listMemberships = contact.get('list-memberships').push(ImmutableMap({
    'static-list-id': listId,
    timestamp: new Date().getTime()
  }));
  var updatedContact = ImmutableMap().set(vid, contact.set('list-memberships', listMemberships));
  return transact({
    operation: function operation() {
      return ListsAPI_addToList(vid, listId);
    },
    commit: [CONTACTS_UPDATED, updatedContact],
    rollback: [CONTACTS_UPDATED, contact]
  }).then(notifyAddToListSuccess.bind(null, contact, restrictedContentObjects), notifyAddToListError);
}
export function removeFromList(contact, listId) {
  var vid = getId(contact);
  var listMemberships = contact.get('list-memberships').filterNot(function (list) {
    return list.get('static-list-id') === listId;
  });
  var updatedContact = contact.set('list-memberships', listMemberships);
  return transact({
    operation: function operation() {
      return ListsAPI_removeFromList(vid, listId);
    },
    commit: [CONTACT_SET, updatedContact],
    rollback: [CONTACT_SET, contact]
  }).then(notifyRemoveFromListSuccess, notifyRemoveFromListError);
}
export function bulkRemoveFromList(contactIds, listId) {
  return ListsAPI_bulkRemoveFromList({
    vids: contactIds,
    listId: listId
  }).then(function (response) {
    dispatchImmediate(CONTACTS_REMOVED_FROM_LIST, {
      vids: contactIds
    }, listId);
    return response.get('updated');
  });
}
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}