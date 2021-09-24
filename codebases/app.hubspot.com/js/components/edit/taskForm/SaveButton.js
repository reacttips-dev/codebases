'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { TaskFormButtonPropTypes } from 'task-forms-lib/constants/PropTypes';
import { default as TaskFormsLibSaveButton } from 'task-forms-lib/buttons/SaveButton';

var SaveButton = function SaveButton(props) {
  return /*#__PURE__*/_jsx(TaskFormsLibSaveButton, Object.assign({}, props, {
    /* Tasks forms requires non-empty updates,
    but we don't want to enforce that requirement.
    As long as the task is valid, allow saving. */
    isSaveDisabled: props.isCreateDisabled
  }));
};

SaveButton.propTypes = Object.assign({}, TaskFormButtonPropTypes);
export default SaveButton;