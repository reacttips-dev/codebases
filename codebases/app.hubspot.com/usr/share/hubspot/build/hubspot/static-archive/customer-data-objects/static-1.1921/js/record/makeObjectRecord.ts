import getIn from 'transmute/getIn';
import * as Identifiable from '../protocol/Identifiable';
import { fromJS as _fromJS, Record as ImmutableRecord } from 'immutable';
import PropertyValueRecord from '../property/PropertyValueRecord';
import identity from 'transmute/identity';
var EMPTY_TOSTRING = '-';

var mapProperty = function mapProperty(record, property) {
  if (!record || !property) {
    return undefined;
  }

  return record.getIn(['properties', property, 'value']);
};

var join = function join(arr) {
  var joined = arr.join(' ').trim();

  if (joined === '') {
    return null;
  }

  return joined;
};

var prepStrings = function prepStrings(record, _ref) {
  var primary = _ref.primary,
      secondary = _ref.secondary;

  if (!primary) {
    primary = [];
  }

  if (!secondary) {
    secondary = [];
  }

  var mapPropertyForRecord = mapProperty.bind(null, record);
  var primaryString = typeof primary === 'function' ? primary(record) : join(primary.map(mapPropertyForRecord).filter(identity));
  var secondaryString = typeof secondary === 'function' ? secondary(record) : join(secondary.map(mapPropertyForRecord).filter(identity));
  return {
    primary: primaryString,
    secondary: secondaryString
  };
};

export default function makeObjectRecord(_ref2) {
  var idKey = _ref2.idKey,
      recordName = _ref2.recordName,
      objectType = _ref2.objectType,
      defaults = _ref2.defaults;
  var toStringOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var BaseObjectRecordFactory = ImmutableRecord(defaults, recordName);
  var ObjectRecordFactory = Object.assign(BaseObjectRecordFactory, {
    _idKey: idKey,
    _objectType: objectType,
    toString: function toString(record) {
      if (!record) {
        return EMPTY_TOSTRING;
      }

      var _prepStrings = prepStrings(record, toStringOptions),
          primary = _prepStrings.primary,
          secondary = _prepStrings.secondary;

      return primary || secondary || EMPTY_TOSTRING;
    },
    toStringExpanded: function toStringExpanded(record) {
      if (!record) {
        return EMPTY_TOSTRING;
      }

      var _prepStrings2 = prepStrings(record, toStringOptions),
          primary = _prepStrings2.primary,
          secondary = _prepStrings2.secondary;

      var returnString = '';

      if (primary) {
        returnString = primary;

        if (secondary) {
          return returnString + " (" + secondary + ")";
        }

        return returnString;
      }

      if (secondary) {
        return secondary;
      }

      return EMPTY_TOSTRING;
    },
    fromJS: function fromJS(json) {
      if (json === null || json === undefined) {
        return json;
      }

      var immutable = _fromJS(json);

      if (immutable.has('properties')) {
        immutable = immutable.update('properties', function (properties) {
          return properties.map(PropertyValueRecord.fromJS);
        });
      }

      return ObjectRecordFactory(immutable);
    }
  }); // getIn's type requires a mutable array

  Identifiable.getId.implement(ObjectRecordFactory, getIn(idKey));
  return ObjectRecordFactory;
}