'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Router as ReactRouter, Switch, generatePath } from 'react-router-dom';
import { history } from './history';
import { startRoute } from '../routes/startRoute';
import { useIsRewriteEnabled } from '../rewrite/init/context/IsRewriteEnabledContext';
import { LIST, BOARD } from '../rewrite/views/constants/PageType';
import PortalIdParser from 'PortalIdParser';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import RestoreDraftRoute from '../routes/RestoreDraftRoute';
import TicketsEntryRouteHandler from './routeHandlers/TicketsEntryRouteHandler';
import TicketsListRouteHandler from './routeHandlers/TicketsListRouteHandler';
import TicketsBoardRouteHandler from './routeHandlers/TicketsBoardRouteHandler';
import DealsBoardRouteHandler from './routeHandlers/DealsBoardRouteHandler';
import DealsEntryRouteHandler from './routeHandlers/DealsEntryRouteHandler';
import DealsListRouteHandler from './routeHandlers/DealsListRouteHandler';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { navigateToPath } from '../rewrite/navigation/utils/navigateToPath';
import IndexRoute from '../rewrite/init/components/IndexRoute';
import RestoreRoute from '../rewrite/init/components/RestoreRoute';
import getIn from 'transmute/getIn';
export var RestoreRouteHandler = function RestoreRouteHandler(_ref) {
  var objectTypeId = _ref.objectTypeId,
      queryString = _ref.queryString;
  var isRewriteEnabled = useIsRewriteEnabled();
  return isRewriteEnabled ? /*#__PURE__*/_jsx(RestoreRoute, {}) : /*#__PURE__*/_jsx(RestoreDraftRoute, {
    objectTypeId: objectTypeId,
    queryString: queryString
  });
};
export var getLegacyPath = function getLegacyPath(_ref2) {
  var objectTypeId = _ref2.objectTypeId,
      viewId = _ref2.viewId,
      pageType = _ref2.pageType;
  var viewString = viewId ? "/views/:viewId" : '';
  var pageTypeString = pageType ? "/:pageType" : '';
  return generatePath("/objects/:objectTypeId" + viewString + pageTypeString, {
    objectTypeId: objectTypeId,
    viewId: viewId,
    pageType: pageType
  });
};
export var handleLegacyRoute = function handleLegacyRoute(objectTypeId, pageType) {
  return function (_ref3) {
    var match = _ref3.match,
        location = _ref3.location;
    return /*#__PURE__*/_jsx(Redirect, {
      to: Object.assign({}, location, {
        pathname: getLegacyPath({
          objectTypeId: objectTypeId,
          viewId: getIn(['params', 'viewId'], match),
          pageType: pageType
        })
      })
    });
  };
};

function Router(_ref4) {
  var isRewriteEnabledForType = _ref4.isRewriteEnabledForType;
  var isRewriteEnabled = useIsRewriteEnabled();
  var isDealsRewriteEnabled = isRewriteEnabledForType(DEAL_TYPE_ID);
  var isTicketsRewriteEnabled = isRewriteEnabledForType(TICKET_TYPE_ID);
  return /*#__PURE__*/_jsx(ReactRouter, {
    history: history,
    children: /*#__PURE__*/_jsxs(Switch, {
      children: [/*#__PURE__*/_jsx(Route, {
        path: "/objects/:objectTypeId/restore",
        exact: true,
        children: function children(_ref5) {
          var objectTypeId = _ref5.match.params.objectTypeId,
              search = _ref5.location.search;
          return /*#__PURE__*/_jsx(RestoreRouteHandler, {
            objectTypeId: objectTypeId,
            queryString: search
          });
        }
      }), /*#__PURE__*/_jsx(Route, {
        path: "/start",
        exact: true,
        children: startRoute
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/', '/contacts', '/contacts/list', '/contacts/view/:viewId', '/contacts/list/view/:viewId'],
        exact: true,
        children: handleLegacyRoute(CONTACT_TYPE_ID)
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/companies', '/companies/list', '/companies/view/:viewId', '/companies/list/view/:viewId'],
        exact: true,
        children: handleLegacyRoute(COMPANY_TYPE_ID)
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/deals'].concat(_toConsumableArray(isDealsRewriteEnabled ? [] : ['/objects/0-3', '/objects/0-3/views/:viewId'])),
        exact: true,
        component: DealsEntryRouteHandler
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/deals/list', '/deals/view/:viewId', '/deals/list/view/:viewId'].concat(_toConsumableArray(isDealsRewriteEnabled ? [] : ['/objects/0-3/list', '/objects/0-3/views/:viewId/list'])),
        exact: true,
        component: DealsListRouteHandler
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/deals/board', '/deals/board/view/:viewId'].concat(_toConsumableArray(isDealsRewriteEnabled ? [] : ['/objects/0-3/board', '/objects/0-3/views/:viewId/board'])),
        exact: true,
        component: DealsBoardRouteHandler
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/tickets'].concat(_toConsumableArray(isTicketsRewriteEnabled ? [] : ['/objects/0-5', '/objects/0-5/views/:viewId'])),
        exact: true,
        component: TicketsEntryRouteHandler
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/tickets/list', '/tickets/view/:viewId', '/tickets/list/view/:viewId'].concat(_toConsumableArray(isTicketsRewriteEnabled ? [] : ['/objects/0-5/list', '/objects/0-5/views/:viewId/list'])),
        exact: true,
        component: TicketsListRouteHandler
      }), /*#__PURE__*/_jsx(Route, {
        path: ['/tickets/board', '/tickets/board/view/:viewId'].concat(_toConsumableArray(isTicketsRewriteEnabled ? [] : ['/objects/0-5/board', '/objects/0-5/views/:viewId/board'])),
        exact: true,
        component: TicketsBoardRouteHandler
      }), /*#__PURE__*/_jsx(Route, {
        path: ["/objects/:objectTypeId/:pageType(" + LIST + "|" + BOARD + ")?", "/objects/:objectTypeId/views/:viewId/:pageType(" + LIST + "|" + BOARD + ")?"],
        exact: true,
        component: IndexRoute
      }), /*#__PURE__*/_jsx(Route, {
        "data-test-id": "contacts-redirect",
        render: function render() {
          // If the current type is in the rewrite, we can do a simple in-app navigation
          // to load contacts. If not, we must do a full-page reload to switch state systems.
          if (isRewriteEnabled) {
            return /*#__PURE__*/_jsx(Redirect, {
              to: "/objects/0-1"
            });
          } else {
            navigateToPath("/contacts/" + PortalIdParser.get() + "/objects/0-1");
            return /*#__PURE__*/_jsx(UILoadingSpinner, {});
          }
        }
      })]
    })
  });
}

Router.propTypes = {
  isRewriteEnabledForType: PropTypes.func.isRequired
};
export default /*#__PURE__*/memo(Router);