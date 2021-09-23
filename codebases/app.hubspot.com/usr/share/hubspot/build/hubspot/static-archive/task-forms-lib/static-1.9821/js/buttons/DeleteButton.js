'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from '../constants/PropTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var DeleteButton = function DeleteButton(_ref) {
  var onDelete = _ref.onDelete,
      isDeleteDisabled = _ref.isDeleteDisabled,
      _ref$isDeleteTooltipD = _ref.isDeleteTooltipDisabled,
      isDeleteTooltipDisabled = _ref$isDeleteTooltipD === void 0 ? true : _ref$isDeleteTooltipD,
      deleteButtonTooltipMessage = _ref.deleteButtonTooltipMessage;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: deleteButtonTooltipMessage,
    disabled: isDeleteTooltipDisabled,
    children: /*#__PURE__*/_jsx(UIButton, {
      onClick: onDelete,
      disabled: isDeleteDisabled,
      use: "secondary",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "taskFormsLib.footer.delete"
      })
    }, "delete-task-btn")
  });
};

DeleteButton.propTypes = Object.assign({}, TaskFormButtonPropTypes, {
  onDelete: TaskFormButtonPropTypes.onDelete.isRequired
});
export default DeleteButton;