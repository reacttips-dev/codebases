'use es6';

import { List, fromJS } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';

var formatListId = function formatListId(list) {
  return String(list.listId);
};

var formatListReference = function formatListReference(list) {
  return new ReferenceRecord({
    id: formatListId(list),
    label: list.name,
    referencedObject: fromJS(list)
  });
};

var formatContactLists = function formatContactLists(contactLists) {
  var lists = contactLists.lists;
  return indexBy(get('id'), List(lists).map(formatListReference));
};

export default formatContactLists;