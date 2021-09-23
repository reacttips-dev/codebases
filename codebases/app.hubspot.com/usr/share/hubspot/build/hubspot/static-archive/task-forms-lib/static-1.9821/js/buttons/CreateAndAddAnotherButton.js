'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from '../constants/PropTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';

var CreateAndAddAnotherButton = function CreateAndAddAnotherButton(_ref) {
  var onSaveAndAddAnother = _ref.onSaveAndAddAnother,
      isCreateDisabled = _ref.isCreateDisabled;
  return /*#__PURE__*/_jsx(UIButton, {
    use: "secondary",
    onClick: onSaveAndAddAnother,
    disabled: isCreateDisabled,
    "data-selenium-test": "CreateTaskSidebar__save-and-add-btn",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.createAndAdd"
    })
  }, "create-and-add-another-task-btn");
};

CreateAndAddAnotherButton.propTypes = Object.assign({}, TaskFormButtonPropTypes, {
  onSaveAndAddAnother: TaskFormButtonPropTypes.onSaveAndAddAnother.isRequired
});
export default CreateAndAddAnotherButton;