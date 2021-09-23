'use es6';

import getObjectDefinitions from './getObjectDefinitions';

var getMapOf = function getMapOf(keyProp, valueProp) {
  return getObjectDefinitions().reduce(function (map, objectDefinition) {
    var key = objectDefinition.get(keyProp);
    var value = objectDefinition.get(valueProp);
    map[key] = value;
    return map;
  }, {});
};

var shouldEnableUseInAssociations = function shouldEnableUseInAssociations(objectDefinition, isUndatedForAll) {
  var isEnabled = objectDefinition.get('enableAsAssociatedType');

  if (!isEnabled) {
    return false;
  }

  var gates = objectDefinition.get('gates');

  if (gates && !isUndatedForAll(gates)) {
    return false;
  }

  return true;
};

var ObjectDefinitionProvider = {
  getEnabledForAssociations: function getEnabledForAssociations() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return getObjectDefinitions().filter(function (record) {
      return shouldEnableUseInAssociations.apply(void 0, [record].concat(args));
    });
  },
  getAll: function getAll() {
    return getObjectDefinitions();
  },
  getFiltered: function getFiltered() {
    var _getObjectDefinitions;

    return (_getObjectDefinitions = getObjectDefinitions()).filter.apply(_getObjectDefinitions, arguments);
  },
  getById: function getById(id) {
    return getObjectDefinitions().find(function (_ref) {
      var objectTypeId = _ref.objectTypeId;
      return id === objectTypeId;
    });
  },
  getMapOf: getMapOf
};
export default ObjectDefinitionProvider;