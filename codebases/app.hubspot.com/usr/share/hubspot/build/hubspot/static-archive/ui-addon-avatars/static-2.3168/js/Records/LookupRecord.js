'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Set as ImmutableSet } from 'immutable';
import { API_KNOWN_KEY_MAPPINGS, API_KNOWN_VALUE_MAPPINGS, API_IDENTIFIER_MAPPINGS, OBJECT_TYPES_THAT_REQUIRE_PORTAL_ID } from '../Constants';

var LookupRecord = /*#__PURE__*/function (_Record) {
  _inherits(LookupRecord, _Record);

  function LookupRecord() {
    _classCallCheck(this, LookupRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(LookupRecord).apply(this, arguments));
  }

  _createClass(LookupRecord, [{
    key: "isKnown",
    value: function isKnown() {
      return Object.keys(API_KNOWN_KEY_MAPPINGS).indexOf(this.type) >= 0;
    }
  }, {
    key: "getKnownName",
    value: function getKnownName() {
      if (!this.isKnown()) {
        return undefined;
      }

      return API_KNOWN_KEY_MAPPINGS[this.type];
    }
  }, {
    key: "getKnownObject",
    value: function getKnownObject() {
      var _ref;

      if (!this.isKnown()) {
        return undefined;
      }

      return _ref = {}, _defineProperty(_ref, API_KNOWN_VALUE_MAPPINGS[this.type].primaryIdentifier, this.primaryIdentifier), _defineProperty(_ref, API_KNOWN_VALUE_MAPPINGS[this.type].secondaryIdentifier, this.secondaryIdentifier), _defineProperty(_ref, "fileManagerKey", this.fileManagerKey), _ref;
    }
  }, {
    key: "getIdentifierName",
    value: function getIdentifierName() {
      return API_IDENTIFIER_MAPPINGS[this.type];
    }
  }, {
    key: "getIdentifier",
    value: function getIdentifier() {
      return this.primaryIdentifier;
    }
  }, {
    key: "isSameAs",
    value: function isSameAs(lookup) {
      if (this.type === lookup.type) {
        return this.primaryIdentifier === lookup.primaryIdentifier;
      }

      var haveVid = ImmutableSet.of('contact', 'vid').has(this.type) && ImmutableSet.of('contact', 'vid').has(lookup.type);
      var haveCompanyId = ImmutableSet.of('company', 'companyId').has(this.type) && ImmutableSet.of('company', 'companyId').has(lookup.type);

      if (haveVid || haveCompanyId) {
        return this.primaryIdentifier === lookup.primaryIdentifier;
      }

      if (this.type === 'contact' && lookup.type === 'email' || this.type === 'company' && lookup.type === 'domain') {
        return this.secondaryIdentifier === lookup.primaryIdentifier;
      }

      if (this.type === 'email' && lookup.type === 'contact' || this.type === 'domain' && lookup.type === 'company') {
        return this.primaryIdentifier === lookup.secondaryIdentifier;
      }

      return false;
    }
  }, {
    key: "requiresPortalId",
    value: function requiresPortalId() {
      return OBJECT_TYPES_THAT_REQUIRE_PORTAL_ID.indexOf(this.type) > -1;
    }
  }]);

  return LookupRecord;
}(Record({
  type: undefined,
  primaryIdentifier: undefined,
  secondaryIdentifier: undefined,
  fileManagerKey: undefined,
  dimensions: undefined
}, 'LookupRecord'));

export { LookupRecord as default };