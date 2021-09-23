'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
export default function DisplayValueBoolean(props) {
  var value = props.value;
  return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: value === true ? 'customerDataFilters.DisplayValue.booleanTrue' : 'customerDataFilters.DisplayValue.booleanFalse'
  });
}
DisplayValueBoolean.propTypes = {
  value: PropTypes.bool.isRequired
};