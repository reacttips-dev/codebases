'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from 'task-forms-lib/constants/PropTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';

var AddButton = function AddButton(_ref) {
  var onSave = _ref.onSave,
      isCreateDisabled = _ref.isCreateDisabled;
  return /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    onClick: onSave,
    disabled: isCreateDisabled,
    "data-selenium-test": "sequences-add-task-button",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.insertCardPanel.footer.add"
    })
  });
};

AddButton.propTypes = Object.assign({}, TaskFormButtonPropTypes, {
  onSave: TaskFormButtonPropTypes.onSave.isRequired
});
export default AddButton;