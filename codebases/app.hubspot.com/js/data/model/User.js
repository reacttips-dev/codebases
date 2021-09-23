'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { OrderedMap, Record } from 'immutable';
var DEFAULTS = {
  id: null,
  firstName: null,
  lastName: null,
  email: null
};

var User = /*#__PURE__*/function (_Record) {
  _inherits(User, _Record);

  function User() {
    _classCallCheck(this, User);

    return _possibleConstructorReturn(this, _getPrototypeOf(User).apply(this, arguments));
  }

  _createClass(User, [{
    key: "getFullName",
    value: function getFullName() {
      if (this.firstName && this.lastName) {
        return this.firstName + " " + this.lastName;
      }

      return this.email;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs instanceof User) {
        return attrs;
      }

      return new User(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return OrderedMap(data.map(function (user) {
        return [user.id, User.createFrom(user)];
      })).sortBy(function (u) {
        return u.getFullName();
      });
    }
  }]);

  return User;
}(Record(DEFAULTS));

export { User as default };