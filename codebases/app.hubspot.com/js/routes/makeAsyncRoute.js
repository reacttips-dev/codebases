'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import Loadable from 'UIComponents/decorators/Loadable';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import ErrorPage from '../crm_ui/error/ErrorPage';
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';

var getRouteErrorComponent = function getRouteErrorComponent(_ref) {
  var routeName = _ref.routeName;
  return function RouteErrorComponent(_ref2) {
    var error = _ref2.error;
    useEffect(function () {
      AsyncComponentErrorHandler(routeName)(error);
    }, [error]);
    return /*#__PURE__*/_jsx(ErrorPage, {
      errorCode: "400"
    });
  };
};

export var makeAsyncRoute = function makeAsyncRoute(loader, routeName) {
  return Loadable({
    loader: loader,
    LoadingComponent: function DefaultLoader() {
      return /*#__PURE__*/_jsx(UILoadingOverlay, {});
    },
    ErrorComponent: getRouteErrorComponent(routeName)
  });
};