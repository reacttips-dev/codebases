'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, List } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';

var formatInboundDbList = function formatInboundDbList(list) {
  return new ReferenceRecord({
    id: "" + list.listId,
    label: list.name,
    referencedObject: fromJS(list)
  });
};

var formatInboundDbLists = function formatInboundDbLists(lists) {
  return indexBy(get('id'), List(lists).map(formatInboundDbList));
};

export default formatInboundDbLists;