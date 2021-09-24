'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import map from 'transmute/map';
import get from 'transmute/get';
import isFunction from 'transmute/isFunction';
import identity from 'transmute/identity';
import always from 'transmute/always';
import ifElse from 'transmute/ifElse';
import enviro from 'enviro';

var checkPropTypes = function checkPropTypes(propTypes, props, componentName) {
  var error; // Re-purposing to maintain the contract of throwing for prop type errors

  var getStack = function getStack() {
    error = true; // Don't throw here to allow console error to log

    return '';
  };

  Object.keys(props).forEach(function (key) {
    var propType = propTypes[key];

    if (propType == null) {
      var keys = Object.keys(propTypes).map(function (k) {
        return "`" + k + "`";
      }).join(', ');
      throw new Error("Unexpected prop `" + key + "` supplied to `" + componentName + "`, expected props to be " + keys);
    } // React v15 compatible


    if (PropTypes.checkPropTypes) {
      PropTypes.checkPropTypes(propTypes, props, key, componentName, getStack);
    }

    if (error) {
      throw new Error("Invalid prop `" + key + "` supplied to `" + componentName + "`");
    }
  });
};

var TypedRecord = function TypedRecord(recordDefinition) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'TypedRecord';
  var defaults = map(ifElse(isFunction, always(undefined), get('default')), recordDefinition);
  var propTypes = map(ifElse(isFunction, identity, get('type')), recordDefinition);
  var RecordClass = Record(defaults, name);

  if (enviro.deployed() && enviro.isProd()) {
    return RecordClass;
  }

  var check = function check(record) {
    var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    checkPropTypes(propTypes, Object.assign({}, values, {}, record.toObject()), name);
  };

  function TypedRecordClass(values) {
    if (!(this instanceof TypedRecordClass)) {
      return new TypedRecordClass(values);
    }

    RecordClass.call(this, values);
    check(this, values);
    return this;
  }

  TypedRecordClass.prototype = Object.create(RecordClass.prototype, {
    constructor: {
      value: TypedRecordClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Object.setPrototypeOf(TypedRecordClass, TypedRecord);

  TypedRecordClass.prototype.set = function (key, value) {
    var result = RecordClass.prototype.set.call(this, key, value);
    check(result, _defineProperty({}, key, value));
    return result;
  };

  Object.defineProperty(TypedRecordClass, 'name', {
    value: name
  });
  return TypedRecordClass;
};

export default TypedRecord;