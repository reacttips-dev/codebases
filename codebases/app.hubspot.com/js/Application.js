'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { jsx as _jsx } from "react/jsx-runtime";
import Raven from 'Raven';
import { render } from 'react-dom';
import { RhumbProvider } from 'react-rhumb';
import staticAdapter from 'react-rhumb/staticAdapter';
import PortalIdParser from 'PortalIdParser';
import Url from 'hubspot.urlinator.Url';
import rhumbConfig from '../rhumb-config.yaml';
import ApplicationContainer from './containers/ApplicationContainer';
import AsyncMessagesPreview from './code-splitting/components/AsyncMessagesPreview';
import ErrorBoundary from './components/ErrorBoundary';
import { PREVIEW, STANDARD } from './constants/WidgetModes';
import { initializeI18n } from './utils/initializeI18n';
import { getMessagesUtk } from './query-params/getMessagesUtk';
import { VisitorIdentityContextProvider } from './visitorIdentityContext/VisitorIdentityContext';
import ReduxProvider from './ReduxProvider';

var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);

    this.widgetShellUrl = new Url(window.location);
  }

  _createClass(Application, [{
    key: "getQueryParam",
    value: function getQueryParam(param) {
      return this.widgetShellUrl.paramValue(param);
    }
  }, {
    key: "setSentryTags",
    value: function setSentryTags() {
      Raven.setTagsContext({
        messagesUtk: getMessagesUtk(),
        hubspotUtk: this.getQueryParam('hubspotUtk'),
        isAttachmentDisabled: this.getQueryParam('isAttachmentDisabled') === 'true',
        isFullscreen: this.getQueryParam('isFullscreen') === 'true',
        mode: this.getQueryParam('mode'),
        mobile: this.getQueryParam('mobile') === 'true',
        isEmbeddedInProduct: this.getQueryParam('inApp53') === 'true',
        enableWidgetCookieBanner: this.getQueryParam('enableWidgetCookieBanner')
      });
    }
  }, {
    key: "renderWidget",
    value: function renderWidget() {
      var _this = this;

      initializeI18n().then(function () {
        var inline = _this.getQueryParam('inline') === 'true';
        render( /*#__PURE__*/_jsx(ErrorBoundary, {
          errorLoggingTitle: "visitor-widget",
          children: /*#__PURE__*/_jsx(RhumbProvider, {
            history: staticAdapter('/'),
            config: rhumbConfig,
            children: /*#__PURE__*/_jsx(VisitorIdentityContextProvider, {
              children: /*#__PURE__*/_jsx(ReduxProvider, {
                children: /*#__PURE__*/_jsx(ApplicationContainer, {
                  location: window.location,
                  inline: inline
                })
              })
            })
          })
        }), document.getElementsByClassName('widget')[0]);
      });
    }
  }, {
    key: "renderPreview",
    value: function renderPreview() {
      render( /*#__PURE__*/_jsx(ErrorBoundary, {
        errorLoggingTitle: "message-preview",
        children: /*#__PURE__*/_jsx(VisitorIdentityContextProvider, {
          children: /*#__PURE__*/_jsx(ReduxProvider, {
            children: /*#__PURE__*/_jsx(AsyncMessagesPreview, {
              location: window.location,
              messageId: this.getQueryParam('messageId'),
              messagesUtk: getMessagesUtk()
            })
          })
        })
      }), document.getElementsByClassName('widget')[0]);
    }
  }, {
    key: "start",
    value: function start() {
      window.AppInstance = this;
      this.setSentryTags();
      PortalIdParser.get();

      switch (this.getQueryParam('mode')) {
        case PREVIEW:
          this.renderPreview();
          return;

        case STANDARD:
        default:
          this.renderWidget();
          return;
      }
    }
  }]);

  return Application;
}();

export { Application as default };
var app = new Application();
app.start();