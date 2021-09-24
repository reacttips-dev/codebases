'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { propertyLabelTranslatorWithIsHubSpotDefined } from 'property-translator/propertyTranslator';
import EmptyState from 'customer-data-table/Components/EmptyState';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { memo } from 'react';
import get from 'transmute/get';
import map from 'transmute/map';
import pipe from 'transmute/pipe';

var buildLabel = function buildLabel(values, transform) {
  return map(transform, values // NOTE: see `customer-data-property-utils/parseMultiEnumValue`
  //       (customer-data-table doesn't have a dep on this library or we'd call it directly)
  .split(';').map(function (val) {
    return val.trim();
  }).filter(function (val) {
    return val !== '';
  })).join(', ');
};

var EnumCell = function EnumCell(_ref) {
  var value = _ref.value,
      options = _ref.options,
      isHubspotDefined = _ref.isHubspotDefined;
  if (!value) return /*#__PURE__*/_jsx(EmptyState, {});
  if (!options) return value;

  var mapValueToLabel = function mapValueToLabel(val) {
    var option = options.find(function (x) {
      return get('value', x) === val;
    });
    return {
      label: get('label', option),
      isHubSpotDefined: isHubspotDefined
    };
  };

  var translate = pipe(mapValueToLabel, propertyLabelTranslatorWithIsHubSpotDefined);
  return /*#__PURE__*/_jsx("span", {
    className: "text-left",
    children: buildLabel(value, translate)
  });
};

EnumCell.propTypes = {
  isHubspotDefined: PropTypes.bool,
  options: ImmutablePropTypes.list,
  value: PropTypes.string
};
export default /*#__PURE__*/memo(EnumCell);