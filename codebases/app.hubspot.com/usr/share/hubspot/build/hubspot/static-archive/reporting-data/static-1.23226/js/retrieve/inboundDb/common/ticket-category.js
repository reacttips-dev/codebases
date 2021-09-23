'use es6';

import { List } from 'immutable';
export default function getTicketCategories(obj) {
  var categoriesString = obj.getIn(['properties', 'hs_ticket_category', 'value']);

  if (!categoriesString) {
    return null;
  }

  return List(categoriesString.split(';'));
}