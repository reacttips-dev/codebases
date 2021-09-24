'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap } from 'immutable';
export var CHANNEL_CHANGE = 'CHANNEL_CHANGE';
var ChannelChangeRecord = Record({
  '@type': CHANNEL_CHANGE,
  oldChannel: ImmutableMap(),
  newChannel: ImmutableMap(),
  id: null,
  timestamp: null
}, 'ChannelChange');
export var ChannelChange = /*#__PURE__*/function (_ChannelChangeRecord) {
  _inherits(ChannelChange, _ChannelChangeRecord);

  function ChannelChange(props) {
    _classCallCheck(this, ChannelChange);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChannelChange).call(this, Object.assign({}, props, {
      oldChannel: ImmutableMap(props.oldChannel),
      newChannel: ImmutableMap(props.newChannel),
      '@type': CHANNEL_CHANGE
    })));
  }

  return ChannelChange;
}(ChannelChangeRecord);