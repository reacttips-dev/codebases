'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { getSelectedAssociations } from './getSelectedAssociations';
import { getObjectId, getObjectTypeId } from 'calling-lifecycle-internal/callees/operators/calleesOperators'; // TODO: update associations with callee

export var getDefaultAssociationsWithCallee = function getDefaultAssociationsWithCallee(_ref) {
  var callableObject = _ref.callableObject,
      uasAssociations = _ref.uasAssociations;
  if (!callableObject) return null;
  var calleeId = "" + getObjectId(callableObject);
  var calleeObjectTypeId = getObjectTypeId(callableObject);
  var associations = uasAssociations.get('associations');

  if (!associations.size) {
    return ImmutableMap(_defineProperty({}, calleeObjectTypeId, ImmutableSet([calleeId])));
  }

  var v2AssociationsData = getSelectedAssociations(associations);
  var associationsByTypeId = v2AssociationsData.map(function (association) {
    return association.get('objectIds');
  });
  var calleeObjectTypeAssociations = associationsByTypeId.get(calleeObjectTypeId);

  if (!calleeObjectTypeAssociations) {
    associationsByTypeId = associationsByTypeId.set(calleeObjectTypeId, ImmutableSet([calleeId]));
  } else if (!calleeObjectTypeAssociations.has(calleeId)) {
    associationsByTypeId = associationsByTypeId.update(calleeObjectTypeId, function (set) {
      return set.add(calleeId);
    });
  }

  return associationsByTypeId;
};