'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';

var HubSetting = /*#__PURE__*/function (_Record) {
  _inherits(HubSetting, _Record);

  function HubSetting() {
    _classCallCheck(this, HubSetting);

    return _possibleConstructorReturn(this, _getPrototypeOf(HubSetting).apply(this, arguments));
  }

  return HubSetting;
}(Record({
  hubId: null,
  internal: false,
  key: null,
  value: null
}));

export default HubSetting;