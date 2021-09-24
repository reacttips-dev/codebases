'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIAlert from 'UIComponents/alert/UIAlert';

var AssignmentPanelBulkWarning = function AssignmentPanelBulkWarning(_ref) {
  var showBulkWarning = _ref.showBulkWarning;

  if (!showBulkWarning) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIAlert, {
    className: "m-y-2",
    type: "warning",
    children: "Bulk Warning Message Here"
  });
};

AssignmentPanelBulkWarning.propTypes = {
  showBulkWarning: PropTypes.bool.isRequired
};
export default AssignmentPanelBulkWarning;