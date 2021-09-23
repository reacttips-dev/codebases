'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { fromJS, Map as ImmutableMap, Record } from 'immutable';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { CONTEXT_UPDATE } from '../constants/messageTypes';

var ContextUpdateMessage = /*#__PURE__*/function (_Record) {
  _inherits(ContextUpdateMessage, _Record);

  function ContextUpdateMessage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ContextUpdateMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContextUpdateMessage).call(this, Object.assign({}, options, {
      contexts: options.contexts && options.contexts ? fromJS(options.contexts) : ImmutableMap()
    })));
  }

  return ContextUpdateMessage;
}(Record({
  '@type': CONTEXT_UPDATE,
  id: null,
  timestamp: null,
  contexts: ImmutableMap(),
  hiddenFromVisitor: false,
  messageDeletedStatus: NOT_DELETED
}, 'ContextUpdateMessage'));

export default ContextUpdateMessage;