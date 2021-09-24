'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
var AppIdsToAppName = {
  '1159843': 'Eventbrite',
  '28564': 'Eventbrite',
  '1158066': 'GoToWebinar',
  '35161': 'GoToWebinar',
  '1162897': 'Zoom',
  '178192': 'Zoom'
};

var AppNameCell = function AppNameCell(_ref) {
  var value = _ref.value;
  return /*#__PURE__*/_jsx("span", {
    children: AppIdsToAppName[value] || value
  });
};

export default AppNameCell;