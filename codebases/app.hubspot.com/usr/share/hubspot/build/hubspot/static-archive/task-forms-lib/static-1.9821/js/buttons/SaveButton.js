'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from '../constants/PropTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var SaveButton = function SaveButton(_ref) {
  var onSave = _ref.onSave,
      isSaveDisabled = _ref.isSaveDisabled,
      _ref$isSaveTooltipDis = _ref.isSaveTooltipDisabled,
      isSaveTooltipDisabled = _ref$isSaveTooltipDis === void 0 ? true : _ref$isSaveTooltipDis,
      saveButtonTooltipMessage = _ref.saveButtonTooltipMessage;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: saveButtonTooltipMessage,
    disabled: isSaveTooltipDisabled,
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      onClick: onSave,
      disabled: isSaveDisabled,
      "data-selenium-test": "TaskSidebarFooter__save",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "taskFormsLib.footer.save"
      })
    }, "save-task-btn")
  });
};

SaveButton.propTypes = Object.assign({}, TaskFormButtonPropTypes, {
  onSave: TaskFormButtonPropTypes.onSave.isRequired
});
export default SaveButton;