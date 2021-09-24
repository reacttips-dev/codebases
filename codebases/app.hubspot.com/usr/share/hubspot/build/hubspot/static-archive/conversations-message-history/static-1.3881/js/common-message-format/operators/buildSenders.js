'use es6';

import { fromJS, List } from 'immutable';
import reduce from 'transmute/reduce';
import Sender from '../records/Sender';
export var buildSenders = function buildSenders() {
  var senders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  return reduce(List(), function (senderList, sender) {
    return senderList.push(Sender(fromJS(sender)));
  }, senders);
};