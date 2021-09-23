'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";

var _Record2;

import { Map as ImmutableMap, Record } from 'immutable';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { THREAD_INBOX_UPDATED } from '../constants/messageTypes';

var InboxUpdateMessage = /*#__PURE__*/function (_Record) {
  _inherits(InboxUpdateMessage, _Record);

  function InboxUpdateMessage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, InboxUpdateMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(InboxUpdateMessage).call(this, Object.assign({}, options, {
      auditParams: ImmutableMap(options.auditParams)
    })));
  }

  return InboxUpdateMessage;
}(Record((_Record2 = {}, _defineProperty(_Record2, '@type', THREAD_INBOX_UPDATED), _defineProperty(_Record2, "id", null), _defineProperty(_Record2, "timestamp", null), _defineProperty(_Record2, "hiddenFromVisitor", false), _defineProperty(_Record2, "messageDeletedStatus", NOT_DELETED), _defineProperty(_Record2, "originInboxId", null), _defineProperty(_Record2, "auditParams", ImmutableMap()), _defineProperty(_Record2, "destinationInboxId", null), _Record2), 'InboxUpdateMessage'));

export default InboxUpdateMessage;