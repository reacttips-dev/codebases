'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, List } from 'immutable';
var DEFAULTS = {
  id: null,
  name: '',
  url: '',
  twitter: null,
  facebook: null,
  instagram: null
};

var Company = /*#__PURE__*/function (_Record) {
  _inherits(Company, _Record);

  function Company() {
    _classCallCheck(this, Company);

    return _possibleConstructorReturn(this, _getPrototypeOf(Company).apply(this, arguments));
  }

  _createClass(Company, [{
    key: "getDomain",
    value: function getDomain() {
      return this.url.replace(/https?:\/\//, '').replace('www.', '').replace('/', '');
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      return new Company(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return new List(data.map(Company.createFrom));
    }
  }]);

  return Company;
}(Record(DEFAULTS));

export { Company as default };