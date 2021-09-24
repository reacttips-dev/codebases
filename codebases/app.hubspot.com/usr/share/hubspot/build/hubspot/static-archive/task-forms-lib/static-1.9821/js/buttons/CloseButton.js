'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from '../constants/PropTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';

var CloseButton = function CloseButton(_ref) {
  var onClose = _ref.onClose;
  return /*#__PURE__*/_jsx(UIButton, {
    onClick: onClose,
    disabled: !onClose,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.cancel"
    })
  }, "cancel-task-btn");
};

CloseButton.propTypes = Object.assign({}, TaskFormButtonPropTypes, {
  onClose: TaskFormButtonPropTypes.onClose.isRequired
});
export default CloseButton;