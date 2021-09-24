'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record, OrderedMap } from 'immutable';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
import get from 'transmute/get';
import { createPropertyKey } from '../operators/getPropertyKeys';
export var PhoneNumberPropertyMetadata = /*#__PURE__*/function (_Record) {
  _inherits(PhoneNumberPropertyMetadata, _Record);

  function PhoneNumberPropertyMetadata() {
    _classCallCheck(this, PhoneNumberPropertyMetadata);

    return _possibleConstructorReturn(this, _getPrototypeOf(PhoneNumberPropertyMetadata).apply(this, arguments));
  }

  _createClass(PhoneNumberPropertyMetadata, [{
    key: "toNumberString",
    // The response from this can be passed to twilio to dial a number + extension
    get: function get() {
      var extension = this.get('extension');
      var phoneNumber = this.get('phoneNumber');
      return extension ? phoneNumber + " ext " + extension : phoneNumber;
    }
  }]);

  return PhoneNumberPropertyMetadata;
}(Record({
  extension: null,
  phoneNumber: null,
  phoneNumberType: null,
  possibleNumber: false,
  regionCode: null,
  state: null,
  usnumber: false,
  validNumber: false
}, 'PhoneNumberPropertyMetadata')); // Response from twilio/v1/phonenumberinfo/validate

export var ValidatedNumber = /*#__PURE__*/function (_Record2) {
  _inherits(ValidatedNumber, _Record2);

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
  }]);

  return ValidatedNumber;
}(Record({
  countryCode: null,
  extension: null,
  formattedNumber: null,
  geoPermission: null,
  isBlacklisted: false,
  isFreemium: false,
  isValid: true,
  rawNumber: null,
  requiresTwoPartyConsent: false,
  sourcePropertyName: null
}, 'ValidatedNumber'));
export var PhoneNumberProperty = /*#__PURE__*/function (_Record3) {
  _inherits(PhoneNumberProperty, _Record3);

  function PhoneNumberProperty() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PhoneNumberProperty);

    return _possibleConstructorReturn(this, _getPrototypeOf(PhoneNumberProperty).call(this, Object.assign({}, attributes, {
      metadata: new PhoneNumberPropertyMetadata( // this property comes from the BE as validatedPhoneNumber
      // to avoid confusion we assign it to metadata here
      attributes.validatedPhoneNumber || attributes.metadata || {})
    })));
  }

  return PhoneNumberProperty;
}(Record({
  propertyName: null,
  label: null,
  hubspotDefined: false,
  value: null,
  metadata: new PhoneNumberPropertyMetadata()
}, 'PhoneNumberProperty'));
export var CallableObject = /*#__PURE__*/function (_Record4) {
  _inherits(CallableObject, _Record4);

  _createClass(CallableObject, null, [{
    key: "createReferenceKey",
    value: function createReferenceKey(callableObject) {
      return createPropertyKey({
        objectTypeId: get('objectTypeId', callableObject),
        objectId: get('objectId', callableObject)
      });
    }
  }]);

  function CallableObject() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CallableObject);

    var phoneNumberPropertiesArray = attributes.phoneNumberProperties || [];
    var phoneNumberProperties = phoneNumberPropertiesArray.reduce(function (orderedMap, property) {
      var propertyName = property.propertyName;
      var phoneNumberProperty = new PhoneNumberProperty(property);
      return orderedMap.set(propertyName, phoneNumberProperty);
    }, OrderedMap());
    var additionalProperties = new ImmutableMap(attributes.additionalProperties || {}).map(function (additionalProperty) {
      return new PropertyValueRecord(additionalProperty);
    });
    var optOutOfCommunications = new ImmutableMap(attributes.optOutOfCommunications || {});
    return _possibleConstructorReturn(this, _getPrototypeOf(CallableObject).call(this, Object.assign({}, attributes, {
      phoneNumberProperties: phoneNumberProperties,
      additionalProperties: additionalProperties,
      optOutOfCommunications: optOutOfCommunications
    })));
  }

  _createClass(CallableObject, null, [{
    key: "fromJS",
    value: function fromJS(_ref) {
      var objectId = _ref.objectId,
          objectTypeId = _ref.objectTypeId,
          legacyObjectType = _ref.legacyObjectType,
          name = _ref.name,
          phoneNumberProperties = _ref.phoneNumberProperties,
          additionalProperties = _ref.additionalProperties,
          optOutOfCommunications = _ref.optOutOfCommunications;
      var record = new CallableObject({
        objectId: objectId,
        objectTypeId: objectTypeId,
        legacyObjectType: legacyObjectType,
        name: name
      });
      var phoneNumberPropertiesParsed = OrderedMap(phoneNumberProperties).map(function (property) {
        return new PhoneNumberProperty(property);
      });
      var additionalPropertiesParsed = new ImmutableMap(additionalProperties || {}).map(function (additionalProperty) {
        return new PropertyValueRecord(additionalProperty);
      });
      var optOutOfCommunicationsParsed = new ImmutableMap(optOutOfCommunications || {});
      return record.set('phoneNumberProperties', phoneNumberPropertiesParsed).set('additionalProperties', additionalPropertiesParsed).set('optOutOfCommunications', optOutOfCommunicationsParsed);
    }
  }]);

  return CallableObject;
}(Record({
  objectId: null,
  objectTypeId: null,
  legacyObjectType: null,
  name: null,
  phoneNumberProperties: OrderedMap(),
  additionalProperties: ImmutableMap(),
  optOutOfCommunications: ImmutableMap()
}, 'CallableObject'));
export var AssociatedObjects = /*#__PURE__*/function (_Record5) {
  _inherits(AssociatedObjects, _Record5);

  function AssociatedObjects() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AssociatedObjects);

    return _possibleConstructorReturn(this, _getPrototypeOf(AssociatedObjects).call(this, Object.assign({}, attributes, {
      results: (attributes.results || []).reduce(function (orderedMap, result) {
        var callableObject = new CallableObject(result);
        return orderedMap.set(CallableObject.createReferenceKey(callableObject), callableObject);
      }, OrderedMap())
    })));
  }

  _createClass(AssociatedObjects, null, [{
    key: "fromJS",
    value: function fromJS() {
      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var record = new AssociatedObjects({
        hasMore: attributes.hasMore
      });
      var results = OrderedMap(attributes.results).map(function (callee) {
        return CallableObject.fromJS(callee);
      });
      return record.set('results', results);
    }
  }]);

  return AssociatedObjects;
}(Record({
  hasMore: false,
  results: null
}, 'AssociatedObjects'));
export var AssociatedObjectType = /*#__PURE__*/function (_Record6) {
  _inherits(AssociatedObjectType, _Record6);

  function AssociatedObjectType() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AssociatedObjectType);

    return _possibleConstructorReturn(this, _getPrototypeOf(AssociatedObjectType).call(this, Object.assign({}, attributes, {
      associatedObjects: new AssociatedObjects(attributes.associatedObjects)
    })));
  }

  _createClass(AssociatedObjectType, null, [{
    key: "fromJS",
    value: function fromJS(_ref2) {
      var objectType = _ref2.objectType,
          associatedObjects = _ref2.associatedObjects;
      var result = new AssociatedObjectType({
        objectType: objectType
      });
      return result.set('associatedObjects', AssociatedObjects.fromJS(associatedObjects));
    }
  }]);

  return AssociatedObjectType;
}(Record({
  objectType: null,
  associatedObjects: null
}, 'AssociatedObjectType'));
export var CalleesRecord = /*#__PURE__*/function (_Record7) {
  _inherits(CalleesRecord, _Record7);

  function CalleesRecord() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CalleesRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalleesRecord).call(this, Object.assign({}, attributes, {
      fromObject: attributes.fromObject ? new CallableObject(attributes.fromObject) : null,
      associatedObjectsPage: (attributes.associatedObjectsPage || []).reduce(function (orderedMap, associatedObjectType) {
        return orderedMap.set(associatedObjectType.objectTypeId, new AssociatedObjectType(associatedObjectType));
      }, OrderedMap())
    })));
  } // The constructor is parsing from an API use this to convert a preformatted object to this record


  _createClass(CalleesRecord, null, [{
    key: "fromJS",
    value: function fromJS() {
      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var record = new CalleesRecord();

      if (attributes.fromObject) {
        record = record.set('fromObject', CallableObject.fromJS(attributes.fromObject));
      }

      if (attributes.associatedObjectsPage) {
        record = record.set('associatedObjectsPage', Object.keys(attributes.associatedObjectsPage).reduce(function (orderedMap, associatedObjectTypeId) {
          return orderedMap.set(associatedObjectTypeId, AssociatedObjectType.fromJS(attributes.associatedObjectsPage[associatedObjectTypeId]));
        }, OrderedMap()));
      }

      return record;
    }
  }]);

  return CalleesRecord;
}(Record({
  fromObject: null,
  associatedObjectsPage: null
}, 'CalleesRecord'));