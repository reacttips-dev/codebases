'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Map as ImmutableMap } from 'immutable';
import { CREATE, CREATE_AND_ADD_ANOTHER, CANCEL, SAVE, DELETE } from '../constants/TaskFormButtonTypes';
import UIButton from 'UIComponents/button/UIButton';
import UIList from 'UIComponents/list/UIList';

var TaskFormButtons = function TaskFormButtons(_ref) {
  var _ImmutableMap;

  var buttons = _ref.buttons,
      deleteDisabled = _ref.deleteDisabled,
      onCancel = _ref.onCancel,
      onDelete = _ref.onDelete,
      onSave = _ref.onSave,
      onSaveAndAddAnother = _ref.onSaveAndAddAnother,
      saveDisabled = _ref.saveDisabled;
  var buttonElements = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, CREATE, /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    onClick: onSave,
    disabled: saveDisabled,
    "data-selenium-test": "CreateTaskSidebar__save-btn",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.create"
    })
  }, "create-task-btn")), _defineProperty(_ImmutableMap, CREATE_AND_ADD_ANOTHER, /*#__PURE__*/_jsx(UIButton, {
    use: "secondary",
    onClick: onSaveAndAddAnother,
    disabled: saveDisabled,
    "data-selenium-test": "CreateTaskSidebar__save-and-add-btn",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.createAndAdd"
    })
  }, "create-and-add-another-task-btn")), _defineProperty(_ImmutableMap, SAVE, /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    onClick: onSave,
    disabled: saveDisabled,
    "data-selenium-test": "TaskSidebarFooter__save",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.save"
    })
  }, "save-task-btn")), _defineProperty(_ImmutableMap, DELETE, /*#__PURE__*/_jsx(UIButton, {
    onClick: onDelete,
    disabled: deleteDisabled,
    use: "secondary",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.delete"
    })
  }, "delete-task-btn")), _defineProperty(_ImmutableMap, CANCEL, /*#__PURE__*/_jsx(UIButton, {
    onClick: onCancel,
    disabled: !onCancel,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.footer.cancel"
    })
  }, "cancel-task-btn")), _ImmutableMap));
  return /*#__PURE__*/_jsx(UIList, {
    inline: true,
    children: buttons.map(function (buttonType) {
      return buttonElements.get(buttonType);
    })
  });
};

TaskFormButtons.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.oneOf([CANCEL, CREATE, CREATE_AND_ADD_ANOTHER, DELETE, SAVE])).isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onSaveAndAddAnother: PropTypes.func,
  onDelete: PropTypes.func,
  saveDisabled: PropTypes.bool,
  deleteDisabled: PropTypes.bool
};
export default TaskFormButtons;