'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useEffect } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { logCallingError } from 'calling-error-reporting/report/error';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';

function GDPRErrorComponent(_ref) {
  var errorMessage = _ref.errorMessage,
      error = _ref.error,
      loading = _ref.loading,
      pastDelay = _ref.pastDelay,
      retry = _ref.retry,
      _ref$logError = _ref.logError,
      logError = _ref$logError === void 0 ? true : _ref$logError;
  useEffect(function () {
    if (logError) {
      logCallingError({
        errorMessage: errorMessage,
        extraData: {
          error: error,
          loading: loading,
          pastDelay: pastDelay
        }
      });
    }
  }, [error, errorMessage, loading, logError, pastDelay]);
  return /*#__PURE__*/_jsx(UIAlert, {
    titleText: I18n.text('gdpr.error.title'),
    type: "danger",
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "link",
      onClick: retry,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "gdpr.error.body"
      })
    })
  });
}

GDPRErrorComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error).isRequired,
  loading: PropTypes.bool.isRequired,
  pastDelay: PropTypes.bool.isRequired,
  logError: PropTypes.bool,
  retry: PropTypes.func.isRequired
};
export default /*#__PURE__*/memo(GDPRErrorComponent);