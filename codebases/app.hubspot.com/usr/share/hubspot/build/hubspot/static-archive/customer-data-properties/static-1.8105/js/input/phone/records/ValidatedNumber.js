// Notice: This file is a duplicate that can be found in calling-library.
// TODO: Discuss with team how we might prioritize reducing duplicate code
// and moving it into a sharable library.
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
var DEFAULTS = {
  countryCode: null,
  extension: null,
  formattedNumber: null,
  geoPermission: null,
  isBlacklisted: false,
  isFreemium: false,
  isValid: true,
  rawNumber: null,
  requiresTwoPartyConsent: false,
  sourcePropertyName: null,
  possibleNumber: true
};

var ValidatedNumber = /*#__PURE__*/function (_Record) {
  _inherits(ValidatedNumber, _Record);

  function ValidatedNumber() {
    _classCallCheck(this, ValidatedNumber);

    return _possibleConstructorReturn(this, _getPrototypeOf(ValidatedNumber).apply(this, arguments));
  }

  _createClass(ValidatedNumber, [{
    key: "toNumberString",
    get: function get() {
      var extension = this.get('extension');
      var formattedNumber = this.get('formattedNumber');
      return extension ? formattedNumber + " ext " + extension : formattedNumber;
    }
  }], [{
    key: "fromJS",
    value: function fromJS() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new ValidatedNumber(Object.assign({}, data, {
        isValid: data.isValid || Boolean(data.phoneNumberInfo && data.phoneNumberInfo.validNumber)
      }));
    }
  }]);

  return ValidatedNumber;
}(Record(DEFAULTS, 'ValidatedNumber'));

export default ValidatedNumber;