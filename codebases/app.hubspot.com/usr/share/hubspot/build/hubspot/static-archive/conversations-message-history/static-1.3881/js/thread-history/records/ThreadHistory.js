'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap } from 'immutable';
import ThreadHistoryMessages from './ThreadHistoryMessages';
/**
 * Message History for a Thread
 *
 * @param {Object} properties The properties to build the ThreadHistory with
 * @param {Map} properties.messages
 * @param {Iterable} properties.messages.results An iterable list of messages
 * @param {Boolean} properties.messages.hasMore Whether a threadHistory has more messages to fetch
 * @param {Object} properties.messages.offset Contains pagination offset information
 * @param {Number} properties.messages.offset.timestamp
 * @param {Number} properties.messages.offset.ordinal
 * @param {Number} properties.visitorLastReadAtTimestamp
 * @param {Number} properties.numSoftDeletedMessages
 * @param {Map} properties.attachments A Map of all of the attachments for the viewable thread
 */

var ThreadHistory = /*#__PURE__*/function (_Record) {
  _inherits(ThreadHistory, _Record);

  function ThreadHistory() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ThreadHistory);

    //properties.messages should be transformed and not leaked
    var messages = properties.messages,
        remainingProperties = _objectWithoutProperties(properties, ["messages"]);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreadHistory).call(this, Object.assign({}, remainingProperties, {
      messages: new ThreadHistoryMessages(messages)
    })));
  }

  return ThreadHistory;
}(Record({
  messages: null,
  visitorLastReadAtTimestamp: 0,
  numSoftDeletedMessages: 0,
  attachments: ImmutableMap()
}, 'ThreadHistory'));

export default ThreadHistory;