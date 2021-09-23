'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import get from 'transmute/get';
import { List } from 'immutable';
import { useCallback, useMemo } from 'react';
import { listOf } from 'react-immutable-proptypes';
import toJS from 'transmute/toJS';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { getPropertyResolver } from 'reference-resolvers-lite/utils/getPropertyResolver';
import ReferenceLiteSearchSelect from 'reference-resolvers-lite/components/ReferenceLiteSearchSelect';
import PropTypes from 'prop-types';
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import { getTransferableProps } from '../utils/filterInputProps'; // This component serves as an interface to reference resolvers lite. The select
// component it provides only supports arrays so we have to check if the options
// in the operator are an Immutable List and if they are convert them to/from a
// JS array.

var ExternalOptionEnumQuickFilter = function ExternalOptionEnumQuickFilter(props) {
  var menuWidth = props.menuWidth,
      objectTypeId = props.objectTypeId,
      onChange = props.onChange,
      options = props.options,
      property = props.property,
      value = props.value,
      placeholder = props.placeholder,
      rest = _objectWithoutProperties(props, ["menuWidth", "objectTypeId", "onChange", "options", "property", "value", "placeholder"]);

  var resolver = getPropertyResolver({
    property: property,
    objectTypeId: objectTypeId
  });
  var safeOnChange = useCallback(function (event) {
    onChange(SyntheticEvent(List(event.target.value)));
  }, [onChange]);
  var jsOptions = useMemo(function () {
    return toJS(options).map(function (_ref) {
      var label = _ref.label,
          optionValue = _ref.value;
      return {
        text: label,
        value: optionValue
      };
    });
  }, [options]);
  var jsValue = useMemo(function () {
    return value && toJS(value);
  }, [value]);
  var humanReadableNumberOfItemsSelected = get('length', jsValue) && " (" + get('length', jsValue) + ")" || '';
  return /*#__PURE__*/_jsx(ReferenceLiteSearchSelect, Object.assign({}, getTransferableProps(rest, {
    multi: true
  }), {
    menuWidth: menuWidth,
    onChange: safeOnChange,
    options: jsOptions,
    resolver: resolver,
    value: jsValue,
    multi: true,
    _forcePlaceholder: true,
    placeholder: "" + placeholder + humanReadableNumberOfItemsSelected
  }));
};

ExternalOptionEnumQuickFilter.propTypes = {
  menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  objectTypeId: AnyCrmObjectTypePropType.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([PropTypes.array, listOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))]),
  placeholder: PropTypes.string,
  property: PropertyType.isRequired,
  value: listOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};
export default ExternalOptionEnumQuickFilter;