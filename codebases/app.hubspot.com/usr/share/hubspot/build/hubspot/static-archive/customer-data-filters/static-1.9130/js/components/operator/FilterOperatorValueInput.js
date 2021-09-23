'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import ReferenceResolverLiteType from 'reference-resolvers-lite/components/proptypes/ReferenceResolverLiteType';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';

var getIsMulti = function getIsMulti(fieldName, operator) {
  return operator.constructor.isIterableField(fieldName);
};

var FilterOperatorValueInput = function FilterOperatorValueInput(props) {
  var fieldName = props.fieldName,
      filterFamily = props.filterFamily,
      getReferencedObjectType = props.getReferencedObjectType,
      getSpecialOptionsForReferenceType = props.getSpecialOptionsForReferenceType,
      InputComponent = props.InputComponent,
      onChange = props.onChange,
      resolver = props.resolver,
      value = props.value,
      rest = _objectWithoutProperties(props, ["fieldName", "filterFamily", "getReferencedObjectType", "getSpecialOptionsForReferenceType", "InputComponent", "onChange", "resolver", "value"]);

  var handleChange = useCallback(function (_ref) {
    var nextValue = _ref.target.value;
    onChange(SyntheticEvent(value.set(fieldName, nextValue)));
  }, [fieldName, onChange, value]);
  var specialOptions = getSpecialOptionsForReferenceType(getReferencedObjectType(filterFamily, value));
  return /*#__PURE__*/_jsx(InputComponent, Object.assign({}, rest, {
    field: value.field,
    fieldType: value.field.type,
    filterFamily: filterFamily,
    multi: getIsMulti(fieldName, value),
    numberDisplayHint: value.field.numberDisplayHint,
    onChange: handleChange,
    options: value.field.options,
    resolver: resolver,
    showCurrencySymbol: !!value.field.showCurrencySymbol,
    specialOptions: specialOptions,
    value: value.get(fieldName)
  }));
};

FilterOperatorValueInput.propTypes = {
  InputComponent: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  filterFamily: PropTypes.string.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  resolver: PropTypes.oneOfType([ReferenceResolverType, ReferenceResolverLiteType]),
  value: FilterOperatorType.isRequired
};
FilterOperatorValueInput.defaultProps = {
  fieldName: 'value'
};
export default /*#__PURE__*/memo(FilterOperatorValueInput);