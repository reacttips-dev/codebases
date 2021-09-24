'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useEffect } from 'react';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedPhoneNumber from 'I18n/components/FormattedPhoneNumber';
import PropTypes from 'prop-types';
import { logCallingError } from 'calling-error-reporting/report/error';
import { getExtension, getPhoneNumber, getMetadata, getPropertyName, getValue } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { PhoneNumberProperty } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import { getPropertyLabel } from 'calling-lifecycle-internal/callees/operators/getPhoneNumberPropertyLabel';
/**
 * Generic phoneNumber formatting with a property name
 * ex: +1 (555) 555-5555, ext. 123 (Phone Number)
 */

function PhoneNumberWithProperty(_ref) {
  var phoneNumberProperty = _ref.phoneNumberProperty;
  var propertyName = getPropertyName(phoneNumberProperty);
  var phoneNumberMetadata = getMetadata(phoneNumberProperty);
  var phoneNumber = getPhoneNumber(phoneNumberMetadata);
  var extension = getExtension(phoneNumberMetadata);
  var translatedPropertyLabel = getPropertyLabel(phoneNumberProperty);
  useEffect(function () {
    var rawPhoneNumber = getValue(phoneNumberProperty);

    if (!rawPhoneNumber) {
      logCallingError({
        errorMessage: 'phoneNumberProperty does not contain a value',
        extraData: {
          phoneNumberProperty: phoneNumberProperty
        }
      });
    }
  }, [phoneNumberProperty, propertyName]);

  if (!phoneNumber) {
    var rawPhoneNumber = getValue(phoneNumberProperty);

    if (!rawPhoneNumber) {
      return translatedPropertyLabel || propertyName;
    }

    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "callee-phone-numbers.rawNumberOption",
      options: {
        rawPhoneNumber: rawPhoneNumber,
        propertyName: translatedPropertyLabel || propertyName
      }
    });
  }

  return /*#__PURE__*/_jsx(FormattedJSXMessage, {
    message: "callee-phone-numbers.numberOption_jsx",
    options: {
      phoneNumber: phoneNumber,
      extension: extension,
      propertyName: translatedPropertyLabel || propertyName
    },
    elements: {
      FormattedPhoneNumber: FormattedPhoneNumber
    }
  });
}

PhoneNumberWithProperty.propTypes = {
  phoneNumberProperty: PropTypes.instanceOf(PhoneNumberProperty).isRequired
};
export default /*#__PURE__*/memo(PhoneNumberWithProperty);