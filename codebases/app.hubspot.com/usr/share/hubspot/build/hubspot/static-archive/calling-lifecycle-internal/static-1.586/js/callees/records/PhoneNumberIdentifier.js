'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
export var PhoneNumberIdentifier = /*#__PURE__*/function (_Record) {
  _inherits(PhoneNumberIdentifier, _Record);

  function PhoneNumberIdentifier() {
    _classCallCheck(this, PhoneNumberIdentifier);

    return _possibleConstructorReturn(this, _getPrototypeOf(PhoneNumberIdentifier).apply(this, arguments));
  }

  _createClass(PhoneNumberIdentifier, [{
    key: "toKey",
    value: function toKey() {
      return this.objectTypeId + "_" + this.objectId + "_" + this.propertyName;
    }
  }]);

  return PhoneNumberIdentifier;
}(Record({
  objectTypeId: null,
  objectId: null,
  propertyName: null
}, 'PhoneNumberIdentifier'));