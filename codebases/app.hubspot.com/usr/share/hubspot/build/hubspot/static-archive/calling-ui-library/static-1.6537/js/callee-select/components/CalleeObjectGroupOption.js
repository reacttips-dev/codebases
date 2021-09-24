'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import { translateObjectName } from 'customer-data-objects/record/translateObjectName';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { calleeName } from 'calling-lifecycle-internal/callees/utils/calleeName';
import { getObjectType } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';

function CalleeObjectGroupOption(_ref) {
  var callableObject = _ref.callableObject,
      objectTypeId = _ref.objectTypeId;
  var calleeObjectName = calleeName(callableObject);
  var callableObjectType = getObjectType(callableObject);
  var text = callableObjectType !== ObjectTypeFromIds[objectTypeId] ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "callee-selection.objectGroupHeader",
    options: {
      name: calleeObjectName,
      objectType: translateObjectName(callableObjectType)
    }
  }) : calleeObjectName;
  return /*#__PURE__*/_jsx("div", {
    className: "is--heading-7 p-left-4 m-bottom-1 p-right-4",
    children: text
  });
}

export default /*#__PURE__*/memo(CalleeObjectGroupOption);