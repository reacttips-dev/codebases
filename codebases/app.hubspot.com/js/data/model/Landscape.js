'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import Company from './Company';
var DEFAULTS = {
  id: null,
  companies: null,
  posts: null
};

var Landscape = /*#__PURE__*/function (_Record) {
  _inherits(Landscape, _Record);

  function Landscape() {
    _classCallCheck(this, Landscape);

    return _possibleConstructorReturn(this, _getPrototypeOf(Landscape).apply(this, arguments));
  }

  _createClass(Landscape, [{
    key: "hasCompanies",
    value: function hasCompanies() {
      return this.companies && this.companies.size;
    }
  }, {
    key: "hasData",
    value: function hasData() {
      return this.hasCompanies() && this.posts && this.posts.size;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs.companies) {
        attrs.companies = Company.createFromArray(attrs.companies);
      }

      return new Landscape(attrs);
    }
  }]);

  return Landscape;
}(Record(DEFAULTS));

export { Landscape as default };