'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import HubSetting from './HubSetting';

var HubSettings = /*#__PURE__*/function (_Record) {
  _inherits(HubSettings, _Record);

  function HubSettings() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HubSettings);

    return _possibleConstructorReturn(this, _getPrototypeOf(HubSettings).call(this, {
      'engagements:ActivityTypes:Enabled': new HubSetting(settings['engagements:ActivityTypes:Enabled']),
      GDPRComplianceEnabled: new HubSetting(settings['GDPRComplianceEnabled'])
    }));
  }

  return HubSettings;
}(Record({
  'engagements:ActivityTypes:Enabled': false,
  GDPRComplianceEnabled: false
}));

export default HubSettings;