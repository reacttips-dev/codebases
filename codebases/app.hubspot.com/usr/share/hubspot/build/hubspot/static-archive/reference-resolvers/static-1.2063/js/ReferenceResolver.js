'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { makeAllResolver } from './strategy/AllStrategy';
import { makeIdResolver } from './strategy/IdStrategy';
import { makeSearchResolver } from './strategy/SearchStrategy';
import emptyFunction from 'react-utils/emptyFunction';
import invariant from 'react-utils/invariant';
import isObject from 'transmute/isObject';
import isString from 'transmute/isString';
export var ReferenceResolver = /*#__PURE__*/function () {
  function ReferenceResolver(definition, name) {
    _classCallCheck(this, ReferenceResolver);

    invariant(isObject(definition), 'expected `definition` to be an Object but got `%s`', definition);
    invariant(isString(name), 'expected `name` to be a string but got `%s`', name);
    this._name = name;
    var all = definition.all,
        byId = definition.byId,
        search = definition.search,
        _definition$refreshCa = definition.refreshCache,
        refreshCache = _definition$refreshCa === void 0 ? emptyFunction : _definition$refreshCa;
    this.all = all && makeAllResolver(all);
    this.byId = byId && makeIdResolver(byId);
    this.search = search && makeSearchResolver(search);
    this.refreshCache = refreshCache;

    this.getDefinition = function () {
      return definition;
    };
  }

  _createClass(ReferenceResolver, [{
    key: "toString",
    value: function toString() {
      return this._name + "<" + Object.keys(this.getDefinition()).join(',') + ">";
    }
  }]);

  return ReferenceResolver;
}();
export function isReferenceResolver(thing) {
  return thing instanceof ReferenceResolver;
}
export function makeReferenceResolver(definition) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ReferenceResolver';
  return new ReferenceResolver(definition, name);
}