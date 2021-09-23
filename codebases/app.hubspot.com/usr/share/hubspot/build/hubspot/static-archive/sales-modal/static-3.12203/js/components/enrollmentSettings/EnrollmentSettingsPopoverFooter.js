'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import Small from 'UIComponents/elements/Small';

var EnrollmentSettingsPopoverFooter = function EnrollmentSettingsPopoverFooter(_ref) {
  var numberOfEdits = _ref.numberOfEdits,
      handleSave = _ref.handleSave,
      handleClose = _ref.handleClose;
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(UIButton, {
      use: "tertiary",
      size: "small",
      onClick: handleSave,
      disabled: numberOfEdits < 1,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceOptions.enrollmentSettings.save"
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary-light",
      size: "small",
      onClick: handleClose,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceOptions.enrollmentSettings.cancel"
      })
    }), numberOfEdits > 0 && /*#__PURE__*/_jsx(Small, {
      className: "m-left-2",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceOptions.enrollmentSettings.numberOfChanges",
        options: {
          count: numberOfEdits
        }
      })
    })]
  });
};

EnrollmentSettingsPopoverFooter.propTypes = {
  numberOfEdits: PropTypes.number.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default EnrollmentSettingsPopoverFooter;