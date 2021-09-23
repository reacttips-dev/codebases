'use es6';

export var toCrmObjectKey = function toCrmObjectKey(_ref) {
  var objectId = _ref.objectId,
      objectTypeId = _ref.objectTypeId;
  return objectId + "-" + objectTypeId;
};
export var fromCrmObjectKey = function fromCrmObjectKey(crmObjectKey) {
  var splitIndex = crmObjectKey.indexOf('-');
  var objectId = crmObjectKey.slice(0, splitIndex);
  var objectTypeId = crmObjectKey.slice(splitIndex + 1);
  return {
    objectId: objectId,
    objectTypeId: objectTypeId
  };
};