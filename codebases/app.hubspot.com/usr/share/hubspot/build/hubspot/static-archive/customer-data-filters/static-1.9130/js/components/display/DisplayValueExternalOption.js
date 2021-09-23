'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { listOf } from 'react-immutable-proptypes';
import { useMemo } from 'react';
import { useFetchResolver } from 'reference-resolvers-lite/ResolverHooks';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import PropTypes from 'prop-types';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';

var DisplayValueExternalOption = function DisplayValueExternalOption(props) {
  var getFamilyValueResolver = props.getFamilyValueResolver,
      operator = props.operator,
      specialOptions = props.specialOptions,
      value = props.value;
  var resolver = getFamilyValueResolver(operator);

  var _useFetchResolver = useFetchResolver(resolver, value),
      reference = _useFetchResolver.reference;

  var resolvedValue = useMemo(function () {
    if (specialOptions) {
      var specialValue = specialOptions.findLast(function (option) {
        return option.value === value;
      });

      if (specialValue) {
        return specialValue.label || specialValue.value;
      }
    }

    if (reference) {
      return reference.label || reference.id;
    }

    return value;
  }, [reference, specialOptions, value]);
  return /*#__PURE__*/_jsx("span", {
    children: resolvedValue
  });
};

DisplayValueExternalOption.propTypes = {
  getFamilyValueResolver: PropTypes.func.isRequired,
  operator: FilterOperatorType.isRequired,
  specialOptions: listOf(PropTypes.instanceOf(PropertyOptionRecord).isRequired),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
export default DisplayValueExternalOption;