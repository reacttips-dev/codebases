import * as React from 'react';
export var ManagerReferenceNodeContext = React.createContext();
export var ManagerReferenceNodeSetterContext = React.createContext();
export function Manager(_ref) {
  var children = _ref.children;

  var _React$useState = React.useState(null),
      referenceNode = _React$useState[0],
      setReferenceNode = _React$useState[1];

  React.useEffect(function () {
    return function () {
      setReferenceNode(null);
    };
  }, [setReferenceNode]);
  return /*#__PURE__*/React.createElement(ManagerReferenceNodeContext.Provider, {
    value: referenceNode
  }, /*#__PURE__*/React.createElement(ManagerReferenceNodeSetterContext.Provider, {
    value: setReferenceNode
  }, children));
}