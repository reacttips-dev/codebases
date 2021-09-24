'use es6';

import { List } from 'immutable';
var MERGE_TAGS = List(['CONTACT', 'COMPANY', 'SENDER', 'PLACEHOLDER', 'DEAL', 'TICKET']);
export default (function (_ref) {
  var includeTicketTokens = _ref.includeTicketTokens,
      includeCustomTokens = _ref.includeCustomTokens;
  var filteredTags = [];

  if (!includeTicketTokens) {
    filteredTags.push('TICKET');
  }

  if (!includeCustomTokens) {
    filteredTags.push('PLACEHOLDER');
  }

  return MERGE_TAGS.filter(function (tag) {
    return filteredTags.indexOf(tag) === -1;
  }).toArray();
});