'use es6';
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, fromJS } from 'immutable';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';
import { AWAY_MODE_CHANGE } from '../constants/messageTypes';

var AgentAvailabilityMessage = /*#__PURE__*/function (_Record) {
  _inherits(AgentAvailabilityMessage, _Record);

  function AgentAvailabilityMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AgentAvailabilityMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('buildTypingMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(AgentAvailabilityMessage).call(this, map));
  }

  return AgentAvailabilityMessage;
}(Record({
  '@type': AWAY_MODE_CHANGE,
  agentId: null,
  awayMode: null,
  id: '',
  timestamp: null,
  updatedByAgentId: null
}, 'AgentAvailabilityMessage'));

export default AgentAvailabilityMessage;