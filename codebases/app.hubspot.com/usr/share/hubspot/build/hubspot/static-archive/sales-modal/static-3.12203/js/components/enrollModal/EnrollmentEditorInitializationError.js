'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';

var EnrollmentEditorInitializationError = function EnrollmentEditorInitializationError(_ref) {
  var initEnrollment = _ref.initEnrollment;
  return /*#__PURE__*/_jsx(UIFlex, {
    align: "center",
    justify: "center",
    className: "enrollment-editor-loading-error",
    children: /*#__PURE__*/_jsx(UIErrorMessage, {
      type: "badRequest",
      children: /*#__PURE__*/_jsx(UIButton, {
        onClick: initEnrollment,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.generalError.tryAgain"
        })
      })
    })
  });
};

EnrollmentEditorInitializationError.propTypes = {
  initEnrollment: PropTypes.func.isRequired
};
export default EnrollmentEditorInitializationError;