import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import formatPhoneNumber from 'I18n/utils/formatPhoneNumber';
import { Record } from 'immutable';
import { PhoneNumberSources } from '../../constants/PhoneNumberSources';
var DEFAULTS = {
  phoneNumber: '',
  friendlyName: '',
  sid: '',
  countryCode: '',
  dateUpdated: '',
  default: false,
  source: PhoneNumberSources.EXTERNAL_NUMBER
};

var RegisteredFromNumber = /*#__PURE__*/function (_Record) {
  _inherits(RegisteredFromNumber, _Record);

  function RegisteredFromNumber() {
    _classCallCheck(this, RegisteredFromNumber);

    return _possibleConstructorReturn(this, _getPrototypeOf(RegisteredFromNumber).apply(this, arguments));
  }

  _createClass(RegisteredFromNumber, [{
    key: "formatted",
    get: function get() {
      return formatPhoneNumber(this.get('friendlyName'), '');
    }
  }]);

  return RegisteredFromNumber;
}(Record(DEFAULTS, 'RegisteredFromNumber'));

export { RegisteredFromNumber as default };