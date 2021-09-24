'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import Status from '../../common-message-format/records/Status';
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { TYPICAL_RESPONSE_TIME } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';

var TypicalResponseTimeMessage = /*#__PURE__*/function (_Record) {
  _inherits(TypicalResponseTimeMessage, _Record);

  function TypicalResponseTimeMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TypicalResponseTimeMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      status: buildStatus(props.status),
      timestamp: props.timestamp || generateUniqueClientTimestamp('TypicalResponseTimeMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(TypicalResponseTimeMessage).call(this, map));
  }

  return TypicalResponseTimeMessage;
}(Record({
  '@type': TYPICAL_RESPONSE_TIME,
  id: null,
  text: '',
  timestamp: null,
  sender: ImmutableMap(),
  status: Status(),
  messageDeletedStatus: NOT_DELETED
}, 'TypicalResponseTimeMessage'));

export default TypicalResponseTimeMessage;