import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
var defaults = {
  appId: 0,
  height: 600,
  isReady: true,
  name: '',
  supportsCustomObjects: false,
  url: '',
  width: 400
};

var CallingProvider = /*#__PURE__*/function (_Record) {
  _inherits(CallingProvider, _Record);

  function CallingProvider(props) {
    _classCallCheck(this, CallingProvider);

    var providerAttributes = props || defaults;
    var appId = providerAttributes.appId || defaults.appId;
    var height = providerAttributes.height || defaults.height;
    var url = providerAttributes.url || defaults.url;
    var width = providerAttributes.width || defaults.width;
    var isReady = typeof providerAttributes.isReady === 'boolean' ? providerAttributes.isReady : defaults.isReady;
    var supportsCustomObjects = typeof providerAttributes.supportsCustomObjects === 'boolean' ? providerAttributes.supportsCustomObjects : defaults.supportsCustomObjects;
    return _possibleConstructorReturn(this, _getPrototypeOf(CallingProvider).call(this, {
      name: providerAttributes.name,
      appId: appId,
      height: height,
      isReady: isReady,
      supportsCustomObjects: supportsCustomObjects,
      url: url,
      width: width
    }));
  }

  return CallingProvider;
}(Record(defaults, 'CallingProvider'));

export default CallingProvider;