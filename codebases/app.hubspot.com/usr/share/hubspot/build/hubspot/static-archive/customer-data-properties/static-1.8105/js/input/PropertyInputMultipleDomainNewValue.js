'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PropTypes from 'prop-types';
import { isValidDomain } from 'customer-data-properties/validation/PropertyValidations';
import UIEditableControls from 'UIComponents/editable/UIEditableControls';
import PropertyInputDomain from './PropertyInputDomain';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';

function PropertyInputMultipleDomainNewValue(_ref) {
  var domains = _ref.domains,
      _onSave = _ref.onSave,
      onCancel = _ref.onCancel;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var duplicateValue = domains.includes(value);
  var isSaveDisabled = !value || !isValidDomain(value) || duplicateValue;
  return /*#__PURE__*/_jsxs(UIGrid, {
    children: [/*#__PURE__*/_jsx(UIGridItem, {
      size: {
        xs: 8
      },
      children: /*#__PURE__*/_jsx(UIEditableControls, {
        className: "m-bottom-1",
        onCancel: onCancel,
        onSave: function onSave() {
          return _onSave(value);
        },
        saveDisabled: isSaveDisabled,
        use: "flush",
        children: /*#__PURE__*/_jsx(PropertyInputDomain, {
          autoFocus: true,
          className: "p-x-2",
          onChange: function onChange(e) {
            return setValue(e.target.value);
          },
          value: value
        })
      })
    }), /*#__PURE__*/_jsx(UIGridItem, {
      size: {
        xs: 4
      }
    })]
  });
}

PropertyInputMultipleDomainNewValue.propTypes = {
  domains: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
export default PropertyInputMultipleDomainNewValue;