'use es6';

import I18n from 'I18n';
import { mutableDescriptionDefaults } from './mutableDescriptionDefaults';

var tryLookup = function tryLookup(key) {
  var temp = I18n.lookup(key);
  var translation = temp && typeof temp !== 'function' && I18n.text(key);
  return translation || undefined;
};

export var propertyDescriptionTranslator = function propertyDescriptionTranslator(_ref) {
  var name = _ref.name,
      objectTypeId = _ref.objectTypeId,
      loadedDescription = _ref.description;

  if (name === undefined || objectTypeId === undefined || loadedDescription === undefined) {
    throw new Error('Expected to be called with {name, objectTypeId, description}');
  }

  if (!(typeof objectTypeId === 'string' && objectTypeId.match(/^\d-\d+$/))) {
    throw new Error("Expected objectTypeId to be a string in format \"#-#\" but got " + objectTypeId);
  }

  var mutableDescription = mutableDescriptionDefaults[objectTypeId] && mutableDescriptionDefaults[objectTypeId][name];

  if (mutableDescription && mutableDescription !== loadedDescription) {
    // we should only use the loadedDescription if the description
    //   is mutable (exists in the mutable description defaults object)
    //   and it does not match the existing description provided
    // this is not a fallback solution
    return loadedDescription;
  }

  if (objectTypeId.startsWith('2-')) {
    return tryLookup("descriptions.CUSTOM." + name);
  }

  return tryLookup("descriptions." + objectTypeId + "." + name);
};