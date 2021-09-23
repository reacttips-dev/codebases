'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ReferenceLiteSearchSelect from 'reference-resolvers-lite/components/ReferenceLiteSearchSelect';
import { getPropertyResolver } from 'reference-resolvers-lite/utils/getPropertyResolver';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
export var PropertyInputExternalOption = function PropertyInputExternalOption(props) {
  //the "All Properties" page passes in the object type as a prop to the component but not in props.property like every other app
  var objectType = props.objectType; // If objectType does not map to a legacy standard objectTypeId and objectTypeId is not part of the property definition,
  // we should try to fall back on the objectType that is passed in as it could be a custom object type id.

  var objectTypeId = ObjectTypesToIds[objectType] || props.property.get('objectTypeId') || objectType;
  var resolver = getPropertyResolver({
    property: props.property,
    objectTypeId: objectTypeId
  });
  return /*#__PURE__*/_jsx(ReferenceLiteSearchSelect, Object.assign({}, props, {
    resolver: resolver
  }));
};