'use es6';

import { createContext, useContext } from 'react';
import memoize from 'react-utils/memoize';
import devLogger from 'react-utils/devLogger';
export var defaultDropdownContext = {
  shouldLogModalWarning: false
};
export var DropdownContext = /*#__PURE__*/createContext(defaultDropdownContext);
var Provider = DropdownContext.Provider;
export { Provider as DropdownContextProvider };
var hasReportedDropdown = false;
export var createPlacementWarning = memoize(function (componentName) {
  return function () {
    if (hasReportedDropdown) return;

    if (window.newrelic) {
      window.newrelic.addPageAction("componentInDropdown", {
        componentName: componentName
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      devLogger.warn({
        message: "A `" + componentName + "` was rendered within a `UIDropdown`. Please refactor.",
        url: 'https://git.hubteam.com/HubSpot/UIComponents/issues/8857',
        key: componentName + "-in-dropdown"
      });
    }
  };
});
export var DropdownContextComponent = function DropdownContextComponent(_ref) {
  var componentName = _ref.componentName;

  var _useContext = useContext(DropdownContext),
      shouldLogModalWarning = _useContext.shouldLogModalWarning;

  var memoizedCreatePlacementWarning = createPlacementWarning(componentName);

  if (shouldLogModalWarning) {
    memoizedCreatePlacementWarning();
  }

  return null;
}; // For testing only

export var resetDropdownReporter = function resetDropdownReporter() {
  hasReportedDropdown = false;
};