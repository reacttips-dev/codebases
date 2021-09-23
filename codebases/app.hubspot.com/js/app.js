/* eslint no-new: 0 */
'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { jsx as _jsx } from "react/jsx-runtime";
import i18n from 'I18n';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import userInfo from 'hub-http/userInfo';
import PortalIdParser from 'PortalIdParser';
import createHistory from 'SequencesUI/util/createHistory';
import { hasSequencesAccess } from './lib/permissions';
import configureStore from './util/configureStore';
import { tracker } from './util/UsageTracker';
import { RhumbProvider } from 'react-rhumb';
import historyAdapter from 'react-rhumb/historyAdapterV3';
import rhumbConfig from '../rhumb-config.yaml';
import GateContainer from './data/GateContainer';
import UserContainer from './data/UserContainer';
import PortalContainer from './data/PortalContainer';
import EmailConfirmBarPrebuilt from 'email-confirm-ui/prebuilts/HubHttpPrebuilt';
import { DataFetchingClient, DataFetchingClientProvider } from 'data-fetching-client';
import generateRoutes from './lib/routes';
import initScopeContainer from './initializers/initScopeContainer';
var GATES_TO_CHECK = ['Sequences:EnrollmentsReadOnlyView', 'Sequences:WootricSurveyEnabled', 'Sequences:WorkflowEnroll', 'Sequences:EmbeddedAutomation', 'sequences-settings-tab', 'Sequences:NewEmailPerformance'];
var client = new DataFetchingClient();

var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);
  }

  _createClass(Application, [{
    key: "start",
    value: function start() {
      window.AppInstance = this;

      if (window.newrelic && window.performance && window.performance.getEntriesByName) {
        var scriptStartEntries = window.performance.getEntriesByName('scriptStartTime');

        if (scriptStartEntries.length > 0) {
          window.newrelic.setCustomAttribute('scriptStartTime', scriptStartEntries[0].startTime);
          window.newrelic.setCustomAttribute('appStartTime', window.performance.now());
        }
      }

      this.init().then(this.actualStart.bind(this)).done();
    }
  }, {
    key: "init",
    value: function init() {
      PortalIdParser.get();
      return Promise.all([userInfo(), i18n.Info]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            authData = _ref2[0];

        var user = authData.user,
            gates = authData.gates,
            portal = authData.portal;
        UserContainer.set(user);
        PortalContainer.set(fromJS(portal));
        initScopeContainer(user.scopes);
        GateContainer.set(GATES_TO_CHECK.reduce(function (acc, gate) {
          acc[gate] = gates.includes(gate);
          return acc;
        }, {}));

        if (!hasSequencesAccess()) {
          return window.location.href = "/upgrade/" + PortalIdParser.get() + "/sequences";
        }

        return {
          authData: authData
        };
      });
    }
  }, {
    key: "actualStart",
    value: function actualStart() {
      tracker.track('pageView', {
        subscreen: 'sequences-index'
      });
      this.startRedux();
      new EmailConfirmBarPrebuilt();
    }
  }, {
    key: "startRedux",
    value: function startRedux() {
      this.store = configureStore();
      this.initRouter();
    }
  }, {
    key: "initRouter",
    value: function initRouter() {
      var pageContainer = document.getElementsByClassName('page')[0];
      var history = createHistory("/sequences/" + PortalIdParser.get());
      ReactDOM.render( /*#__PURE__*/_jsx(RhumbProvider, {
        captureExceptions: true,
        config: rhumbConfig,
        history: historyAdapter(history),
        children: /*#__PURE__*/_jsx(Provider, {
          store: this.store,
          children: /*#__PURE__*/_jsx(DataFetchingClientProvider, {
            client: client,
            children: /*#__PURE__*/_jsx(Router, {
              routes: generateRoutes(),
              history: history
            })
          })
        })
      }), pageContainer);
    }
  }]);

  return Application;
}();

export { Application as default };