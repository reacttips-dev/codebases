'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Route, IndexRoute } from 'react-router';
import Loadable from 'UIComponents/decorators/Loadable';
import prefetcher from './prefetcher';
import Application from '../components/Application';
import SequencesIndexContainer from '../containers/SequencesIndexContainer';
import SequencesScheduleContainer from '../containers/SequencesScheduleContainer';
import ErrorComponent from '../components/loadable/ErrorComponent';
import LoadingComponent from '../components/loadable/LoadingComponent';
import NotFound from '../components/NotFound';
import SequencesOverviewContainer from '../containers/SequencesOverviewContainer';
import { ENROLLMENTS, PERFORMANCE, SETTINGS } from '../constants/SequenceSummaryTabNames';
var SequenceCreate = prefetcher(Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "builder-bundle" */
    '../components/create/SequenceCreate');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
}));
var SequenceSummarySearchContainer = prefetcher(Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "summary-bundle" */
    '../containers/SequenceSummarySearchContainer');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
}));
var SequenceEnrollContactModalContainer = prefetcher(Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "summary-bundle" */
    '../containers/SequenceEnrollContactModalContainer');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
}));
var SequenceBuilderContainer = prefetcher(Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "builder-bundle" */
    '../containers/SequenceBuilderContainer');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
}));
var SequencesRemediationContainer = prefetcher(Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "remediation-bundle" */
    '../containers/SequencesRemediationContainer');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
}));

var SequenceSummaryPerformancePageRoute = function SequenceSummaryPerformancePageRoute(props) {
  return /*#__PURE__*/_jsx(SequenceSummarySearchContainer, Object.assign({}, props, {
    selectedTab: PERFORMANCE
  }));
};

var SequenceSummaryEnrollmentsPageRoute = function SequenceSummaryEnrollmentsPageRoute(props) {
  return /*#__PURE__*/_jsx(SequenceSummarySearchContainer, Object.assign({}, props, {
    selectedTab: ENROLLMENTS
  }));
};

var SequenceSummarySettingsPageRoute = function SequenceSummarySettingsPageRoute(props) {
  return /*#__PURE__*/_jsx(SequenceSummarySearchContainer, Object.assign({}, props, {
    selectedTab: SETTINGS
  }));
};

export default function generateRoutes() {
  return /*#__PURE__*/_jsxs(Route, {
    path: "/",
    component: Application,
    children: [/*#__PURE__*/_jsx(IndexRoute, {
      component: SequencesOverviewContainer
    }), /*#__PURE__*/_jsx(Route, {
      path: "overview",
      component: SequencesOverviewContainer
    }), /*#__PURE__*/_jsx(Route, {
      path: "manage",
      component: SequencesIndexContainer
    }), /*#__PURE__*/_jsx(Route, {
      path: "scheduled",
      component: SequencesScheduleContainer
    }), /*#__PURE__*/_jsx(Route, {
      path: "sequence/:sequenceId",
      component: SequenceSummaryPerformancePageRoute,
      children: /*#__PURE__*/_jsx(Route, {
        path: "enroll",
        component: SequenceEnrollContactModalContainer
      })
    }), /*#__PURE__*/_jsx(Route, {
      path: "sequence/:sequenceId/enrollments",
      component: SequenceSummaryEnrollmentsPageRoute,
      children: /*#__PURE__*/_jsx(Route, {
        path: "enroll",
        component: SequenceEnrollContactModalContainer
      })
    }), /*#__PURE__*/_jsx(Route, {
      path: "sequence/:sequenceId/settings",
      component: SequenceSummarySettingsPageRoute,
      children: /*#__PURE__*/_jsx(Route, {
        path: "enroll",
        component: SequenceEnrollContactModalContainer
      })
    }), /*#__PURE__*/_jsx(Route, {
      path: "sequence/:sequenceId/edit",
      component: SequenceBuilderContainer
    }), /*#__PURE__*/_jsx(Route, {
      path: "create",
      component: SequenceCreate
    }), /*#__PURE__*/_jsx(Route, {
      path: "reenroll",
      component: SequencesRemediationContainer
    }), /*#__PURE__*/_jsx(Route, {
      path: "*",
      component: NotFound
    })]
  });
}