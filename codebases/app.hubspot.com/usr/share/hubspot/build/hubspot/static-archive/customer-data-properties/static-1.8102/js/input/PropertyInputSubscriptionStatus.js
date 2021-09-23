'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { makeOptionsFromPropertyWithoutBlankOptions } from 'customer-data-property-utils/PropertyValueDisplay';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import UISelect from 'UIComponents/input/UISelect';
import UIStatusDot from 'UIComponents/tag/UIStatusDot';
var AVATAR_MAPPING = {
  active: /*#__PURE__*/_jsx(UIStatusDot, {
    use: "active"
  }),
  past_due: /*#__PURE__*/_jsx(UIStatusDot, {
    use: "warning"
  }),
  unpaid: /*#__PURE__*/_jsx(UIStatusDot, {
    use: "danger"
  }),
  canceled: /*#__PURE__*/_jsx(UIStatusDot, {
    use: "default"
  }),
  expired: /*#__PURE__*/_jsx(UIStatusDot, {
    use: "default"
  })
};

var PropertyInputSubscriptionStatus = function PropertyInputSubscriptionStatus(_ref) {
  var buttonUse = _ref.buttonUse,
      className = _ref.className,
      onChange = _ref.onChange,
      property = _ref.property,
      readOnly = _ref.readOnly,
      value = _ref.value;

  if (value === null || value === undefined) {
    return '--';
  }

  var statusOptions = makeOptionsFromPropertyWithoutBlankOptions(property).map(function (option) {
    return Object.assign({}, option, {
      avatar: AVATAR_MAPPING[option.value]
    });
  });
  return /*#__PURE__*/_jsx(UISelect, {
    buttonUse: buttonUse,
    className: className,
    onChange: onChange,
    options: statusOptions,
    readOnly: readOnly !== undefined ? readOnly : property.get('readOnlyValue'),
    value: value
  });
};

PropertyInputSubscriptionStatus.propTypes = {
  buttonUse: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  readOnly: PropTypes.bool,
  value: PropTypes.string
};
PropertyInputSubscriptionStatus.defaultProps = {
  buttonUse: 'form'
};
export default PropertyInputSubscriptionStatus;