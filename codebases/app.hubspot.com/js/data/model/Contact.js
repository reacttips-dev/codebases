'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record } from 'immutable';
import { identity, reduce } from 'underscore';
var DEFAULTS = {
  vid: null,
  email: null,
  properties: ImmutableMap()
};

var Contact = /*#__PURE__*/function (_Record) {
  _inherits(Contact, _Record);

  function Contact() {
    _classCallCheck(this, Contact);

    return _possibleConstructorReturn(this, _getPrototypeOf(Contact).apply(this, arguments));
  }

  _createClass(Contact, [{
    key: "getName",
    value: function getName() {
      var firstName = this.properties.get('firstname');
      var lastName = this.properties.get('lastname');
      return [firstName, lastName].filter(identity).join(' ');
    }
  }], [{
    key: "createFrom",
    value: function createFrom(data) {
      // can be a plain map, or a map of objects with a `value` key if directly from CAPI
      var properties = reduce(data.properties, function (acc, propertyValue, propertyName) {
        if (propertyValue == null) {
          return acc;
        }

        if (propertyValue.name) {
          propertyName = propertyValue.name;
        }

        acc[propertyName] = typeof propertyValue === 'object' ? propertyValue.value : propertyValue;
        return acc;
      }, {});
      return new Contact({
        properties: ImmutableMap(properties),
        email: properties.email,
        vid: data.vid
      });
    }
  }]);

  return Contact;
}(Record(DEFAULTS));

export { Contact as default };