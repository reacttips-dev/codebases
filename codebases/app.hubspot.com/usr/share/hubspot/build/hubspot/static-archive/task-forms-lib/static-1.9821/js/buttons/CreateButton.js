'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from '../constants/PropTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';

var CreateButton = function CreateButton(_ref) {
  var onSave = _ref.onSave,
      isCreateDisabled = _ref.isCreateDisabled,
      size = _ref.size;
  return /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    onClick: onSave,
    disabled: isCreateDisabled,
    "data-selenium-test": "CreateTaskSidebar__save-btn",
    size: size,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.create"
    })
  }, "create-task-btn");
};

CreateButton.propTypes = Object.assign({}, TaskFormButtonPropTypes, {
  onSave: TaskFormButtonPropTypes.onSave.isRequired,
  size: UIButton.propTypes.size
});
export default CreateButton;