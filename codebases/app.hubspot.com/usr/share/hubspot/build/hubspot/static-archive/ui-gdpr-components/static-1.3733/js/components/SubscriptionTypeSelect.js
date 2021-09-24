'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import LegacySubscriptionTypeSelect from './LegacySubscriptionTypeSelect';
import SubscriptionTypeForm from './SubscriptionTypeForm';

var SubscriptionTypeSelect = function SubscriptionTypeSelect(props) {
  var isUngatedForSubscriptionGroups = props.isUngatedForSubscriptionGroups,
      multi = props.multi;

  if (isUngatedForSubscriptionGroups && !multi) {
    return /*#__PURE__*/_jsx(SubscriptionTypeForm, Object.assign({}, props));
  } else {
    return /*#__PURE__*/_jsx(LegacySubscriptionTypeSelect, Object.assign({}, props));
  }
};

SubscriptionTypeSelect.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  multi: PropTypes.bool,
  isUngatedForSubscriptionGroups: PropTypes.bool
};
export default SubscriptionTypeSelect;