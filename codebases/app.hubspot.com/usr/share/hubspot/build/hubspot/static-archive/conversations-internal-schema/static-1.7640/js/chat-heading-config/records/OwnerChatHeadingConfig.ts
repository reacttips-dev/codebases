import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record as ImmutableRecord, fromJS } from 'immutable';
import get from 'transmute/get';
import { OWNER } from '../constants/ChatHeadingConfigTypes';
import { buildChatHeadingConfig } from '../builders/buildChatHeadingConfig';

var OwnerChatHeadingConfig = /*#__PURE__*/function (_ImmutableRecord) {
  _inherits(OwnerChatHeadingConfig, _ImmutableRecord);

  function OwnerChatHeadingConfig(options) {
    _classCallCheck(this, OwnerChatHeadingConfig);

    var optionMap = fromJS(options);
    var fallback = get('fallback', optionMap);
    return _possibleConstructorReturn(this, _getPrototypeOf(OwnerChatHeadingConfig).call(this, {
      fallback: buildChatHeadingConfig(fallback)
    }));
  }

  return OwnerChatHeadingConfig;
}(ImmutableRecord({
  '@type': OWNER,
  fallback: null
}, 'OwnerChatHeadingConfig'));

export default OwnerChatHeadingConfig;