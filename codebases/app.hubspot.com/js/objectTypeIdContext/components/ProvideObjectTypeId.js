'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ObjectTypeIdContext } from '../context/ObjectTypeIdContext';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import { ObjectTypeIdRecord } from '../records/ObjectTypeIdRecord';

var ProvideObjectTypeId = function ProvideObjectTypeId(_ref) {
  var children = _ref.children,
      _ref$objectTypeId = _ref.objectTypeId,
      objectTypeId = _ref$objectTypeId === void 0 ? null : _ref$objectTypeId;

  var _useState = useState(objectTypeId && ObjectTypeIdRecord.fromString(objectTypeId)),
      _useState2 = _slicedToArray(_useState, 2),
      objectTypeIdRecord = _useState2[0],
      setObjectTypeId = _useState2[1];

  useEffect(function () {
    if (objectTypeId) {
      setObjectTypeId(ObjectTypeIdRecord.fromString(objectTypeId));
    }
  }, [objectTypeId]);
  return /*#__PURE__*/_jsx(ObjectTypeIdContext.Provider, {
    value: objectTypeIdRecord,
    children: children
  });
};

ProvideObjectTypeId.propTypes = {
  objectTypeId: ObjectTypeIdType,
  children: PropTypes.node.isRequired
};
export default ProvideObjectTypeId;