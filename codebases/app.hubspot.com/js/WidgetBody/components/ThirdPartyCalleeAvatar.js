'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import { getObjectTypeId, getObjectId, getAdditionalProperties } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { COMPANY_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import CalleeAvatarSkeleton from 'calling-lifecycle-internal/skeleton-states/components/CalleeAvatarSkeleton';
import { getFormattedName } from '../../callee-properties/operators/propertyValueGetters';

function ThirdPartyCalleeAvatar(_ref) {
  var selectedCallableObject = _ref.selectedCallableObject,
      portalId = _ref.portalId;
  if (!selectedCallableObject) return /*#__PURE__*/_jsx(CalleeAvatarSkeleton, {});
  var calleeIdentifier = {};
  var calleeTypeId = getObjectTypeId(selectedCallableObject);
  var objectId = getObjectId(selectedCallableObject);

  if (calleeTypeId === COMPANY_TYPE_ID) {
    calleeIdentifier.companyId = objectId;
  } else {
    calleeIdentifier.vid = objectId;
  }

  var additionalProperties = getAdditionalProperties(selectedCallableObject);
  var formattedName = getFormattedName(additionalProperties);
  return /*#__PURE__*/_jsx("div", {
    className: "justify-center m-top-7 m-bottom-2",
    children: /*#__PURE__*/_jsx(UIAvatar, Object.assign({
      displayName: formattedName,
      portalId: portalId
    }, calleeIdentifier, {
      size: "xl"
    }))
  });
}

export default /*#__PURE__*/memo(ThirdPartyCalleeAvatar);