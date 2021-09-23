'use es6';

import keySeq from 'transmute/keySeq';

function mergeObjects(toObject, fromObject) {
  return keySeq(fromObject).reduce(function (mutatingObject, key) {
    if (key in toObject && typeof toObject[key] === 'object' && typeof fromObject[key] === 'object') {
      mutatingObject[key] = Object.assign({}, toObject[key], {}, fromObject[key]);
    } else if (typeof fromObject[key] === 'object') {
      mutatingObject[key] = Object.assign({}, fromObject[key]);
    } else {
      mutatingObject[key] = fromObject[key];
    }

    return mutatingObject;
  }, toObject);
}

export default function (toObject, fromObject) {
  if (!toObject && !fromObject) {
    return toObject;
  } else if (!toObject && fromObject) {
    return Object.assign({}, fromObject);
  } else if (!fromObject && toObject) {
    return Object.assign({}, toObject);
  }

  if (typeof toObject !== 'object' || typeof fromObject !== 'object') {
    var unsupportedArg = typeof toObject !== 'object' ? 'toObject' : 'fromObject';
    var unsupportedType = typeof toObject !== 'object' ? typeof toObject : typeof fromObject;
    throw new Error("mergeTwoLevelsDeep - Argument \"" + unsupportedArg + "\" is of type \"" + unsupportedType + "\" and not an object.");
  }

  var newObject = Object.assign({}, toObject);
  return mergeObjects(newObject, fromObject);
}