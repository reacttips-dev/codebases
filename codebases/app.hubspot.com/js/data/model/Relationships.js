'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record } from 'immutable';
var DEFAULTS = {
  follower: ImmutableMap(),
  following: ImmutableMap()
};

var Relationships = /*#__PURE__*/function (_Record) {
  _inherits(Relationships, _Record);

  function Relationships() {
    _classCallCheck(this, Relationships);

    return _possibleConstructorReturn(this, _getPrototypeOf(Relationships).apply(this, arguments));
  }

  _createClass(Relationships, null, [{
    key: "createFrom",
    value: function createFrom(attrs) {
      return new Relationships(attrs);
    }
  }]);

  return Relationships;
}(Record(DEFAULTS));

export { Relationships as default };