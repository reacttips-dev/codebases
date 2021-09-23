'use es6';

import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { isObjectTypeId, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import withGateOverride from 'crm_data/gates/withGateOverride';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import { useStoreDependency } from 'general-store';

var massageToTypeId = function massageToTypeId(type) {
  return isObjectTypeId(type) ? type : ObjectTypesToIds[type];
};
/**
 * @desc is my {fromObject}->{toObject} association a {firstType}_TO_{secondType} OR {secondType}_TO_{firstType} ?
 * @param ObjectType OR ObjectTypeId firstType, start object
 * @param ObjectType OR ObjectTypeId secondType, end object
 * @param ObjectType OR ObjectTypeId fromObject, start currentObject
 * @param ObjectType OR ObjectTypeId toObject, end currentObject
 * @return function in which you pass in fromObject and toObject
 */


export var isTwoWayAssociation = function isTwoWayAssociation(firstType, secondType) {
  return function (fromObject, toObject) {
    // if you pass in typeIds instead of object names, it works too nice
    if (isObjectTypeId(fromObject) && isObjectTypeId(toObject)) {
      var firstTypeId = massageToTypeId(firstType);
      var secondTypeId = massageToTypeId(secondType);
      return fromObject === firstTypeId && toObject === secondTypeId || fromObject === secondTypeId && toObject === firstTypeId;
    }

    return fromObject === firstType && toObject === secondType || fromObject === secondType && toObject === firstType;
  };
};
var isUngatedForFlexibleAssociationsDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('flexible-associations', IsUngatedStore.get('flexible-associations'));
  }
};
/**
 * @desc determines if pairing is flexible associations enabled and the portal is ungated
 * @param ObjectType OR ObjectTypeId fromObject, first object to check, ex COMPANY
 * @param ObjectType OR ObjectTypeId to, second object to check, ex CONTACT
 * @return Boolean
 */

var useIsUngatedForFlexibleAssociations = function useIsUngatedForFlexibleAssociations(fromObject, toObject) {
  var isUngatedForFlexibleAssociations = useStoreDependency(isUngatedForFlexibleAssociationsDependency);
  var isFlexEnabledPairing = isTwoWayAssociation(COMPANY, CONTACT)(fromObject, toObject) || isTwoWayAssociation(COMPANY, DEAL)(fromObject, toObject) || isTwoWayAssociation(COMPANY, TICKET)(fromObject, toObject) || isTwoWayAssociation(CONTACT, DEAL)(fromObject, toObject) || isTwoWayAssociation(CONTACT, TICKET)(fromObject, toObject) || isTwoWayAssociation(DEAL, TICKET)(fromObject, toObject);

  if (isUngatedForFlexibleAssociations && isFlexEnabledPairing) {
    return true;
  }

  return false;
};

export default useIsUngatedForFlexibleAssociations;