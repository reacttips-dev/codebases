'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import UIFormControl from 'UIComponents/form/UIFormControl';
import PropertyInput from 'crm-ui-legacy-property-input';
import { getPropertyLabel } from '../../properties/utils/getPropertyLabel';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useProperty } from '../../properties/hooks/useProperty';

var BulkPropertyEditor = function BulkPropertyEditor(_ref) {
  var propertyName = _ref.propertyName,
      value = _ref.value,
      onPropertyValueChange = _ref.onPropertyValueChange;
  var objectTypeId = useSelectedObjectTypeId();
  var property = useProperty(propertyName);
  var label = getPropertyLabel(property);
  var handleChange = useCallback(function (_ref2) {
    var newValue = _ref2.target.value;
    return onPropertyValueChange(propertyName, newValue);
  }, [onPropertyValueChange, propertyName]);
  return /*#__PURE__*/_jsx(UIFormControl, {
    label: label,
    children: /*#__PURE__*/_jsx(PropertyInput, {
      autoFocus: true,
      objectType: denormalizeTypeId(objectTypeId),
      property: property,
      subjectId: null,
      value: value,
      onChange: handleChange
    })
  });
};

BulkPropertyEditor.propTypes = {
  propertyName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onPropertyValueChange: PropTypes.func.isRequired
};
export default BulkPropertyEditor;