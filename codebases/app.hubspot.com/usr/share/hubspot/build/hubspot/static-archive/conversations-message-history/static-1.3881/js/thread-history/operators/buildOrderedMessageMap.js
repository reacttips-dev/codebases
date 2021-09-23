'use es6';

import { Iterable, OrderedMap } from 'immutable';
import invariant from 'react-utils/invariant';
import { getId } from '../../common-message-format/operators/commonMessageFormatGetters';
import { buildMessageFromType } from './buildMessageFromType';
/**
 * Construct an OrderedMap<string, MessageModel> from Array<Message Objects>
 *
 * @param {Iterable} messages Message objects returned by the history API
 */

export var buildOrderedMessageMap = function buildOrderedMessageMap() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  invariant(Iterable.isIterable(messages) || Array.isArray(messages), 'Expected messages to be iterable not a `%s`', typeof messages);
  return messages.reduce(function (acc, messageObject) {
    var message = buildMessageFromType(messageObject);
    var key = getId(message);
    return acc.set(key, message);
  }, OrderedMap());
};