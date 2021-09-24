'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import { TYPING } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';
import Status from '../../common-message-format/records/Status';

var TypingIndicatorMessage = /*#__PURE__*/function (_Record) {
  _inherits(TypingIndicatorMessage, _Record);

  function TypingIndicatorMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TypingIndicatorMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('buildTypingMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(TypingIndicatorMessage).call(this, map));
  }

  return TypingIndicatorMessage;
}(Record({
  '@type': TYPING,
  id: null,
  timestamp: null,
  echo: false,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  clientType: null,
  status: Status()
}, 'TypingIndicatorMessage'));

export default TypingIndicatorMessage;