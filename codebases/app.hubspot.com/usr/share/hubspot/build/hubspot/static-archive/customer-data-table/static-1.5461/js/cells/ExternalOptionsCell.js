'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useFetchResolver } from 'reference-resolvers-lite/ResolverHooks';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { getPropertyResolver } from 'reference-resolvers-lite/utils/getPropertyResolver';
import { isLoading, isError } from 'reference-resolvers-lite/Status';
import StringCell from './StringCell';
import LoadingCell from './LoadingCell';
export var ExternalOptionsCell = function ExternalOptionsCell(props) {
  var value = props.value;
  var property = props.property;
  var objectType = property.get('objectType') || props.objectType; //custom objects pass in objectTypeId in the objectType prop

  var objectTypeId = ObjectTypesToIds[objectType] || property.get('objectTypeId') || objectType;
  var resolver = getPropertyResolver({
    property: property,
    objectTypeId: objectTypeId
  });

  var _useFetchResolver = useFetchResolver(resolver, value),
      reference = _useFetchResolver.reference,
      status = _useFetchResolver.status;

  if (isError(status)) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.error.resolver"
    });
  }

  if (isLoading(status)) {
    return /*#__PURE__*/_jsx(LoadingCell, {});
  }

  return /*#__PURE__*/_jsx(StringCell, {
    value: reference && reference.label
  });
};
export default ExternalOptionsCell;