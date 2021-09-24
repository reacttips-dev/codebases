'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import NotUpdatedInLastXDays from 'customer-data-filters/filterQueryFormat/operator/NotUpdatedInLastXDays';
import PropTypes from 'prop-types';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIInputStaticLabel from 'UIComponents/input/UIInputStaticLabel';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UpdatedInLastXDays from 'customer-data-filters/filterQueryFormat/operator/UpdatedInLastXDays';

var FilterOperatorRollingPropertyUpdated = function FilterOperatorRollingPropertyUpdated(_ref) {
  var value = _ref.value,
      onChange = _ref.onChange;

  var handleChangeNumberOfDays = function handleChangeNumberOfDays(_ref2) {
    var days = _ref2.target.value;
    return onChange(SyntheticEvent(value.set('numberOfDays', days)));
  };

  return /*#__PURE__*/_jsx(UIInputStaticLabel, {
    position: "end",
    text: /*#__PURE__*/_jsx(FormattedMessage, {
      message: 'customerDataFilters.FilterOperatorRollingPropertyUpdated.days'
    }),
    children: /*#__PURE__*/_jsx(UINumberInput, {
      onChange: handleChangeNumberOfDays,
      value: value.numberOfDays
    })
  });
};

FilterOperatorRollingPropertyUpdated.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.instanceOf(UpdatedInLastXDays).isRequired, PropTypes.instanceOf(NotUpdatedInLastXDays).isRequired]).isRequired
};
export default FilterOperatorRollingPropertyUpdated;