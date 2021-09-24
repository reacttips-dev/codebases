'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { logCallingError } from 'calling-error-reporting/report/error';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';

function RTEErrorComponent(_ref) {
  var retry = _ref.retry,
      errorMessage = _ref.errorMessage,
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
    titleText: I18n.text('calling-communicator-ui.rte.error.title'),
    type: "danger",
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "link",
      onClick: retry,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "calling-communicator-ui.rte.error.body"
      })
    })
  });
}

RTEErrorComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error).isRequired,
  loading: PropTypes.bool.isRequired,
  pastDelay: PropTypes.bool.isRequired,
  logError: PropTypes.bool,
  retry: PropTypes.func.isRequired
};
export default /*#__PURE__*/memo(RTEErrorComponent);