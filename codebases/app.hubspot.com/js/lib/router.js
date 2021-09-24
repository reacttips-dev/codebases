'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Route, IndexRoute } from 'react-router';
import AppContainer from '../containers/AppContainer';
import PublishingContainer from '../containers/PublishingContainer';
import IndexRouteHandler from '../components/app/IndexRouteHandler';
import { APP_SECTIONS } from './constants';
import Loadable from 'UIComponents/decorators/Loadable';
var AccountsContainer = Loadable({
  loader: function loader() {
    return import('../containers/AccountsContainer'
    /* webpackChunkName: "AccountsContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var CompetitorsContainer = Loadable({
  loader: function loader() {
    return import('../containers/CompetitorsContainer'
    /* webpackChunkName: "CompetitorsContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var FollowMeContainer = Loadable({
  loader: function loader() {
    return import('../containers/FollowMeContainer'
    /* webpackChunkName: "FollowMeContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var InboxContainer = Loadable({
  loader: function loader() {
    return import('../containers/InboxContainer'
    /* webpackChunkName: "InboxContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var MonitoringContainer = Loadable({
  loader: function loader() {
    return import('../containers/MonitoringContainer'
    /* webpackChunkName: "MonitoringContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var NotificationsContainer = Loadable({
  loader: function loader() {
    return import('../containers/NotificationsContainer'
    /* webpackChunkName: "NotificationsContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var OnboardingContainer = Loadable({
  loader: function loader() {
    return import('../containers/OnboardingContainer'
    /* webpackChunkName: "OnboardingContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var PublishingCalendarContainer = Loadable({
  loader: function loader() {
    return import('../containers/PublishingCalendarContainer'
    /* webpackChunkName: "PublishingCalendarContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var ManageDashboard = Loadable({
  loader: function loader() {
    return import('../manage/ManageDashboard'
    /* webpackChunkName: "ManageDashboard" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var AnalyzeContainer = Loadable({
  loader: function loader() {
    return import('../analyze/AnalyzeContainer'
    /* webpackChunkName: "AnalyzeContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var CompareContainer = Loadable({
  loader: function loader() {
    return import('../compare/CompareContainer'
    /* webpackChunkName: "CompareContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var ScheduleContainer = Loadable({
  loader: function loader() {
    return import('../containers/ScheduleContainer'
    /* webpackChunkName: "ScheduleContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});
var StreamEditContainer = Loadable({
  loader: function loader() {
    return import('../containers/StreamEditContainer'
    /* webpackChunkName: "StreamEditContainer" */
    );
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  }
});

var monitoringLegacyRedirect = function monitoringLegacyRedirect(routing, replace) {
  replace(routing.location.pathname.replace('monitoring/inbox', 'inbox') + routing.location.search);
};

var handleLegacyDetailsRoute = function handleLegacyDetailsRoute(routing, replace) {
  if (routing.location.hash.startsWith('#view')) {
    var viewPath = routing.location.hash.replace('#view', 'view');
    replace((routing.location.pathname + "/" + viewPath + routing.location.search).replace('//', '/'));
  }
};

var companiesRedirect = function companiesRedirect(routing, replace) {
  replace(routing.location.pathname.replace('companies', 'competitors') + routing.location.search);
};

export default [/*#__PURE__*/_jsxs(Route, {
  path: "/",
  component: AppContainer,
  children: [/*#__PURE__*/_jsx(Route, {
    id: "welcome",
    appSection: APP_SECTIONS.onboarding,
    path: "welcome",
    component: OnboardingContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "onboarding",
    appSection: APP_SECTIONS.onboarding,
    path: "getting-started",
    component: OnboardingContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "inboxItem",
    appSection: APP_SECTIONS.monitoring,
    path: "inbox/view/:feedKey",
    component: InboxContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "inboxItemDetails",
    appSection: APP_SECTIONS.monitoring,
    path: "inbox/view/:feedKey/details/:id(/:drilldown)",
    component: InboxContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "inbox",
    appSection: APP_SECTIONS.monitoring,
    path: "inbox(/:interactionType)",
    component: InboxContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "inboxDetails",
    appSection: APP_SECTIONS.monitoring,
    path: "inbox(/:interactionType)/details/:id(/:drilldown)",
    component: InboxContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "inboxDetails",
    appSection: APP_SECTIONS.monitoring,
    path: "inbox(/:interactionType)/details/:id/interactions(/:drilldown)",
    component: InboxContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "monitoringLegacyRedirect",
    appSection: APP_SECTIONS.monitoring,
    path: "monitoring/inbox(/:feedKey)",
    onEnter: monitoringLegacyRedirect
  }), /*#__PURE__*/_jsx(Route, {
    id: "monitoringCreate",
    appSection: APP_SECTIONS.monitoring,
    path: "monitoring/new",
    component: StreamEditContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "monitoring",
    appSection: APP_SECTIONS.monitoring,
    path: "monitoring(/:streamGuid)",
    component: MonitoringContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "monitoringEdit",
    appSection: APP_SECTIONS.monitoring,
    path: "monitoring/:streamGuid/edit",
    component: StreamEditContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "competitors",
    appSection: APP_SECTIONS.monitoring,
    path: "competitors(/:subpath)",
    component: CompetitorsContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "companiesRedirect",
    appSection: APP_SECTIONS.monitoring,
    path: "companies(/:subpath)",
    onEnter: companiesRedirect
  }), /*#__PURE__*/_jsx(Route, {
    id: "manage",
    appSection: APP_SECTIONS.manage,
    path: "manage(/:statusType)",
    component: ManageDashboard
  }), /*#__PURE__*/_jsx(Route, {
    id: "manageDetails",
    appSection: APP_SECTIONS.manage,
    path: "manage(/:statusType)/interactions(/:drilldown)",
    component: ManageDashboard
  }), /*#__PURE__*/_jsx(Route, {
    id: "analyze",
    appSection: APP_SECTIONS.analyze,
    path: "analyze",
    component: AnalyzeContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "compare",
    appSection: APP_SECTIONS.compare,
    path: "compare",
    component: CompareContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "monitoringItem",
    appSection: APP_SECTIONS.monitoring,
    path: "monitoring/:streamGuid/:streamItemId",
    component: MonitoringContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "details",
    appSection: APP_SECTIONS.publishing,
    path: "publishing/view/:id(/:drilldown)",
    component: PublishingContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "publishing",
    appSection: APP_SECTIONS.publishing,
    path: "publishing(/:status)",
    component: PublishingContainer,
    onEnter: handleLegacyDetailsRoute
  }), /*#__PURE__*/_jsx(Route, {
    id: "publishingSectionDetails",
    appSection: APP_SECTIONS.publishing,
    path: "publishing/:status/view/:id(/:drilldown)",
    component: PublishingContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "calendar",
    appSection: APP_SECTIONS.publishing,
    path: "calendar",
    component: PublishingCalendarContainer
  }), /*#__PURE__*/_jsx(IndexRoute, {
    id: "publishing",
    component: IndexRouteHandler,
    appSection: APP_SECTIONS.publishing
  })]
}, "app"), /*#__PURE__*/_jsxs(Route, {
  path: "settings",
  component: AppContainer,
  children: [/*#__PURE__*/_jsx(IndexRoute, {
    id: "accounts",
    appSection: APP_SECTIONS.settings,
    component: AccountsContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "accounts",
    appSection: APP_SECTIONS.settings,
    path: "(account/:accountGuid)(accounts)(connect)",
    component: AccountsContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "notifications",
    appSection: APP_SECTIONS.settings,
    path: "email",
    component: NotificationsContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "schedule",
    appSection: APP_SECTIONS.settings,
    path: "schedule",
    component: ScheduleContainer
  }), /*#__PURE__*/_jsx(Route, {
    id: "followMe",
    appSection: APP_SECTIONS.settings,
    path: "follow-me",
    component: FollowMeContainer
  })]
}, "settings")];