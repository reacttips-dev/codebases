'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
export var ObjectTypeIdRecord = /*#__PURE__*/function (_Record) {
  _inherits(ObjectTypeIdRecord, _Record);

  function ObjectTypeIdRecord() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$metaId = _ref.metaId,
        metaId = _ref$metaId === void 0 ? -1 : _ref$metaId,
        _ref$objectId = _ref.objectId,
        objectId = _ref$objectId === void 0 ? -1 : _ref$objectId;

    _classCallCheck(this, ObjectTypeIdRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(ObjectTypeIdRecord).call(this, {
      metaId: Number(metaId),
      objectId: Number(objectId)
    }));
  }

  return ObjectTypeIdRecord;
}(Record({
  metaId: -1,
  objectId: -1
}));

ObjectTypeIdRecord.fromString = function (objectTypeId) {
  var match = objectTypeId && objectTypeId.match(/^(\d)-(\d+)$/);

  if (!match) {
    return null;
  }

  var _match = _slicedToArray(match, 3),
      __objectTypeId = _match[0],
      metaId = _match[1],
      objectId = _match[2];

  return new ObjectTypeIdRecord({
    metaId: metaId,
    objectId: objectId
  });
};