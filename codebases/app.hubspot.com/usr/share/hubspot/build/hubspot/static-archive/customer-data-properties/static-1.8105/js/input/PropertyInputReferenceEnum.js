'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import { List } from 'immutable';
import emptyFunction from 'react-utils/emptyFunction';
import { parseMultiEnumValue } from 'customer-data-property-utils/parseMultiEnumValue';
import { isMultienum } from 'customer-data-objects/property/PropertyIdentifier';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';

var PropertyInputReferenceEnum = function PropertyInputReferenceEnum(props) {
  var _props$onChange = props.onChange,
      onChange = _props$onChange === void 0 ? emptyFunction : _props$onChange,
      value = props.value,
      property = props.property,
      _props$multi = props.multi,
      multi = _props$multi === void 0 ? isMultienum(property) : _props$multi,
      rest = _objectWithoutProperties(props, ["onChange", "value", "property", "multi"]);

  var handleChange = useCallback(function (_ref) {
    var newValue = _ref.target.value;
    onChange(SyntheticEvent(multi ? newValue.join(';') : newValue));
  }, [onChange, multi]);
  var valueProp = useMemo(function () {
    return multi ? List(parseMultiEnumValue(value)) : value;
  }, [value, multi]);
  return /*#__PURE__*/_jsx(ReferenceInputEnum, Object.assign({}, rest, {
    onChange: handleChange,
    value: valueProp,
    multi: multi,
    placeholder: ""
  }));
};

PropertyInputReferenceEnum.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.node,
  multi: PropTypes.bool,
  property: PropTypes.instanceOf(PropertyRecord).isRequired
};
export default PropertyInputReferenceEnum;