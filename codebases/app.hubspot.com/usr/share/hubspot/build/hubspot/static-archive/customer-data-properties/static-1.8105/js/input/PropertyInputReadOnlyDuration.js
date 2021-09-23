'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import FormattedDuration from 'I18n/components/FormattedDuration';
import I18n from 'I18n';
import { EMPTY_PROPERTY_VALUE } from '../constants/EmptyPropertyValue';
var PropertyInputReadOnlyDuration = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var value = _ref.value;

  if (value === null || value === undefined || isNaN(value) || value === '') {
    return EMPTY_PROPERTY_VALUE;
  }

  return /*#__PURE__*/_jsx(FormattedDuration, {
    ref: ref,
    from: I18n.moment().valueOf() - value
  });
});
PropertyInputReadOnlyDuration.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default PropertyInputReadOnlyDuration;