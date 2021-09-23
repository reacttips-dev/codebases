'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import { READ_THREAD } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUuid } from '../../util/generateUuid.js';

var ReadThreadMessage = /*#__PURE__*/function (_Record) {
  _inherits(ReadThreadMessage, _Record);

  function ReadThreadMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ReadThreadMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid()
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(ReadThreadMessage).call(this, map));
  }

  return ReadThreadMessage;
}(Record({
  '@type': READ_THREAD,
  id: null,
  timestamp: null,
  echo: false,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  clientType: null
}, 'ReadThreadMessage'));

export default ReadThreadMessage;