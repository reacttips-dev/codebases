'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ProvideObjectTypeId from './ProvideObjectTypeId';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { useParams } from 'react-router-dom';
export var withProvidedObjectTypeId = function withProvidedObjectTypeId(Component, staticTypeId) {
  return function (props) {
    var objectType = props.objectType;

    var _useParams = useParams(),
        metaTypeId = _useParams.metaTypeId,
        innerId = _useParams.innerId,
        objectTypeId = _useParams.objectTypeId; // Attempt to derive from HOC param, prop, or finally router props


    var derivedTypeId = staticTypeId || ObjectTypesToIds[objectType] || objectTypeId || metaTypeId + "-" + innerId;
    return /*#__PURE__*/_jsx(ProvideObjectTypeId, {
      objectTypeId: derivedTypeId,
      children: /*#__PURE__*/_jsx(Component, Object.assign({}, props))
    });
  };
};