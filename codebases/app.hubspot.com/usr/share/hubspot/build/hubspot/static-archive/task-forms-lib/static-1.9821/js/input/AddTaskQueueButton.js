'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';

var AddTaskQueueButton = function AddTaskQueueButton(_ref) {
  var _onClick = _ref.onClick,
      onTaskChange = _ref.onTaskChange;
  return /*#__PURE__*/_jsx(UIButton, {
    onClick: function onClick() {
      return _onClick(onTaskChange);
    },
    use: "link",
    "data-selenium-test": "create-queue-button-embedded",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "taskFormsLib.addQueue.addQueueButton"
    })
  });
};

AddTaskQueueButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  // Deprecated
  onTaskChange: PropTypes.func
};
export default AddTaskQueueButton;