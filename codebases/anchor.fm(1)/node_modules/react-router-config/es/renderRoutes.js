var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';

var renderRoutes = function renderRoutes(routes) {
  var extraProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return routes ? React.createElement(
    Switch,
    null,
    routes.map(function (route, i) {
      return React.createElement(Route, {
        key: route.key || i,
        path: route.path,
        exact: route.exact,
        strict: route.strict,
        render: function render(props) {
          return React.createElement(route.component, _extends({}, props, extraProps, { route: route }));
        }
      });
    })
  ) : null;
};

export default renderRoutes;