'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { useCallback, useMemo } from 'react';
import ReferenceLiteSearchSelect from 'reference-resolvers-lite/components/ReferenceLiteSearchSelect';
import { getTransferableProps } from './filterInputProps';
import PropTypes from 'prop-types';
import ReferenceResolverLiteType from 'reference-resolvers-lite/components/proptypes/ReferenceResolverLiteType';
import { listOf } from 'react-immutable-proptypes';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent'; // This component serves as an interface to reference resolvers lite. THe select
// component it provides only supports arrays so we have to check if the options
// in the operator are an Immutable List and if they are convert them to/from a
// JS array.

var FilterOperatorExternalOptionInput = function FilterOperatorExternalOptionInput(props) {
  var menuWidth = props.menuWidth,
      onChange = props.onChange,
      options = props.options,
      resolver = props.resolver,
      value = props.value,
      rest = _objectWithoutProperties(props, ["menuWidth", "onChange", "options", "resolver", "value"]);

  var safeOnChange = useCallback(function (event) {
    onChange(SyntheticEvent(List(event.target.value)));
  }, [onChange]);
  var jsOptions = useMemo(function () {
    return options.toArray().map(function (_ref) {
      var label = _ref.label,
          optionValue = _ref.value;
      return {
        text: label,
        value: optionValue
      };
    });
  }, [options]);
  var jsValue = useMemo(function () {
    return value.toArray();
  }, [value]);
  return /*#__PURE__*/_jsx(ReferenceLiteSearchSelect, Object.assign({}, getTransferableProps(rest, {
    multi: true
  }), {
    menuWidth: menuWidth,
    onChange: safeOnChange,
    options: jsOptions,
    resolver: resolver,
    value: jsValue
  }));
};

FilterOperatorExternalOptionInput.propTypes = {
  menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: listOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  resolver: ReferenceResolverLiteType.isRequired,
  value: listOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};
export default FilterOperatorExternalOptionInput;