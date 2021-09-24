'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H3 from 'UIComponents/elements/headings/H3';

var TaskFormHeader = function TaskFormHeader(_ref) {
  var edit = _ref.edit,
      _ref$isRepeating = _ref.isRepeating,
      isRepeating = _ref$isRepeating === void 0 ? false : _ref$isRepeating;
  return /*#__PURE__*/_jsx(H3, {
    children: edit ? isRepeating ? /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.header.editRepeatingTaskTitle"
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.header.editTaskTitle"
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.header.createTaskTitle"
    })
  });
};

TaskFormHeader.propTypes = {
  edit: PropTypes.bool,
  isRepeating: PropTypes.bool
};
export default TaskFormHeader;