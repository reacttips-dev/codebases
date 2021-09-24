'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { getPropertyLabel } from '../../lib/properties/getPropertyLabel';
import StringQuickFilterContent from './StringQuickFilterContent';

var StringQuickFilter = function StringQuickFilter(_ref) {
  var onValueChange = _ref.onValueChange,
      property = _ref.property,
      filter = _ref.filter;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  var toggleOpen = function toggleOpen() {
    return setOpen(function (isOpen) {
      return !isOpen;
    });
  };

  return /*#__PURE__*/_jsx("label", {
    children: /*#__PURE__*/_jsx(UIPopover, {
      autoPlacement: false,
      closeOnOutsideClick: true,
      content: {
        body: /*#__PURE__*/_jsx(StringQuickFilterContent, {
          filter: filter,
          property: property,
          onValueChange: onValueChange
        })
      },
      onOpenChange: toggleOpen,
      open: open,
      placement: "bottom",
      width: 350,
      children: /*#__PURE__*/_jsxs(UIButton, {
        "aria-pressed": open,
        "data-selenium-test": "quickfilters-" + property.name,
        onClick: toggleOpen,
        use: "transparent",
        truncate: true,
        children: [getPropertyLabel(property), /*#__PURE__*/_jsx(UIDropdownCaret, {
          className: "m-left-1"
        })]
      })
    })
  });
};

StringQuickFilter.propTypes = {
  filter: PropTypes.object,
  onValueChange: PropTypes.func.isRequired,
  property: PropertyType.isRequired
};
export default /*#__PURE__*/memo(StringQuickFilter);