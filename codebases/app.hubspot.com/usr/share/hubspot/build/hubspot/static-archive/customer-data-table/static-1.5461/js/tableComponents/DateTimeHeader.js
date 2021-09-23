'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { getUserTz, isInPortalTz } from 'customer-data-table/utils/dateTimeFunctions';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';

var DateTimeHeader = function DateTimeHeader(_ref) {
  var property = _ref.property;
  var label = property.get('label');
  var hubspotDefined = property.get('hubspotDefined');
  return /*#__PURE__*/_jsxs("span", {
    children: [hubspotDefined ? propertyLabelTranslator(label) : label, !isInPortalTz() && " (" + getUserTz() + ")"]
  });
};

DateTimeHeader.propTypes = {
  property: PropTypes.oneOfType([PropTypes.instanceOf(PropertyRecord), ImmutablePropTypes.map])
};
export default DateTimeHeader;