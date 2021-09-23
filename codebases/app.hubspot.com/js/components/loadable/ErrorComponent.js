'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Raven from 'Raven';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
export default function ErrorComponent(_ref) {
  var error = _ref.error;
  useEffect(function () {
    if (error) {
      Raven.captureMessage("Error loading sequence page.", {
        error: error
      });
    }
  }, [error]);
  return /*#__PURE__*/_jsx(UIErrorMessage, {
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "app.loadingError"
    })
  });
}
ErrorComponent.propTypes = {
  error: PropTypes.object
};