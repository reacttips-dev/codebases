'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { logCallingError } from 'calling-error-reporting/report/error';
import UIAlert from 'UIComponents/alert/UIAlert';

function CalleeSelectErrorComponent(_ref) {
  var errorMessage = _ref.errorMessage,
      error = _ref.error,
      loading = _ref.loading,
      pastDelay = _ref.pastDelay,
      _ref$logError = _ref.logError,
      logError = _ref$logError === void 0 ? true : _ref$logError;
  useMemo(function () {
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
    titleText: I18n.text('callee-selection.asyncError.title'),
    type: "danger",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "callee-selection.asyncError.body"
    })
  });
}

CalleeSelectErrorComponent.propTypes = {
  errorMessage: PropTypes.string,
  error: PropTypes.instanceOf(Error),
  loading: PropTypes.bool,
  pastDelay: PropTypes.bool,
  logError: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(CalleeSelectErrorComponent);