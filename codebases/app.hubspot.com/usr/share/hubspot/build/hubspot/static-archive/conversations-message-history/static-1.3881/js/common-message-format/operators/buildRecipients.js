'use es6';

import { fromJS, List } from 'immutable';
import reduce from 'transmute/reduce';
import Recipient from '../records/Recipient';
export var buildRecipients = function buildRecipients() {
  var recipients = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  return reduce(List(), function (recipientList, recipient) {
    return recipientList.push(Recipient(fromJS(recipient)));
  }, recipients);
};