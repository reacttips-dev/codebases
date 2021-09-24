'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from 'customer-data-table/Components/EmptyState';
import PropTypes from 'prop-types';
import { memo } from 'react';
import isUndefined from 'transmute/isUndefined';
import I18n from 'I18n';
import { isPercent } from 'customer-data-objects/property/PropertyIdentifier';

var getDisplayedValue = function getDisplayedValue(property, value) {
  // logic pulled from https://private.hubteam.com/opengrok/xref/all/git.hubteam.com-HubSpot-customer-data-property-utils%23master/static/js/PropertyValueDisplay.js#67 to avoid adding a dependency
  if (value == null) {
    value = '';
  }

  if (isPercent(property)) {
    // Is percent
    return I18n.formatPercentage(value * 100, {
      precision: 2
    });
  } else {
    // Is percentWholeNumber
    return I18n.formatPercentage(value, {
      precision: 2
    });
  }
};

var PercentageCell = function PercentageCell(props) {
  // TODO: log when this cell is used
  var value = props.value,
      property = props.property;

  if (isUndefined(value) || value === '') {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  return /*#__PURE__*/_jsx("span", {
    className: "text-right",
    "data-test-id": "percentage-value",
    children: getDisplayedValue(property, Number(value) || 0)
  });
};

PercentageCell.propTypes = {
  property: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default /*#__PURE__*/memo(PercentageCell);