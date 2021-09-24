import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { getDefaultClientOptions } from './utils/getDefaultClientOptions';
export function enforceDefaultClientOptions(AblyRealtime) {
  return /*#__PURE__*/function (_AblyRealtime) {
    _inherits(Realtime, _AblyRealtime);

    function Realtime(providedOptions) {
      _classCallCheck(this, Realtime);

      var defaultClientOptions = getDefaultClientOptions();
      var clientOptions = Object.assign({}, defaultClientOptions, {}, providedOptions);
      return _possibleConstructorReturn(this, _getPrototypeOf(Realtime).call(this, clientOptions));
    }

    return Realtime;
  }(AblyRealtime);
}