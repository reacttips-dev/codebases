'use es6';

import { getExtensions } from '../Extensions';
import { DefaultExtension } from '../extensions/DefaultExtension';
import getIn from 'transmute/getIn';
export var runBehavior = function runBehavior(behaviorType, _ref) {
  var typeDef = _ref.typeDef,
      hasAllGates = _ref.hasAllGates,
      hasAllScopes = _ref.hasAllScopes;
  var defaultValue = DefaultExtension[behaviorType]({
    typeDef: typeDef,
    hasAllGates: hasAllGates,
    hasAllScopes: hasAllScopes
  });
  var extensions = getExtensions();
  var behavior = getIn([typeDef.objectTypeId, behaviorType], extensions);

  if (behavior) {
    return behavior({
      typeDef: typeDef,
      hasAllGates: hasAllGates,
      hasAllScopes: hasAllScopes,
      defaultValue: defaultValue
    });
  }

  return defaultValue;
};