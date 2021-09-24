'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import Url from 'hubspot.urlinator.Url';
import buildStore from './buildStore';
import { parseStringBoolean } from './utils/parseStringBoolean';
import VisitorIdentity from './visitor-identity/records/VisitorIdentity';
import WidgetUi from './widget-ui/records/WidgetUi';
import { defaultVisitorIdentityContext, VisitorIdentityContext } from './visitorIdentityContext/VisitorIdentityContext';
var widgetShellUrl = new Url(window.location);

function getQueryParam(param) {
  return widgetShellUrl.paramValue(param);
}

function getUrl() {
  var urlParam = getQueryParam('url');

  try {
    return decodeURIComponent(urlParam);
  } catch (error) {
    return urlParam;
  }
}

var _getVisitorIdentityContext = function getVisitorIdentityContext() {
  return defaultVisitorIdentityContext;
};

function startRedux() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var startOpen = parseStringBoolean(getQueryParam('startOpen'));
  var isEmbeddedInProduct = getQueryParam('inApp53') === 'true';
  var defaultStore = Object.assign({}, initialState, {
    visitorIdentity: new VisitorIdentity({
      globalCookieOptOut: getQueryParam('globalCookieOptOut'),
      isFirstVisitorSession: getQueryParam('isFirstVisitorSession') === 'true'
    }),
    widgetUi: WidgetUi({
      isAttachmentDisabled: getQueryParam('isAttachmentDisabled') === 'true',
      isFullscreen: getQueryParam('isFullscreen') === 'true',
      mobile: getQueryParam('mobile') === 'true',
      startOpen: startOpen,
      hideWelcomeMessage: getQueryParam('hideWelcomeMessage') !== 'true',
      domain: getQueryParam('domain'),
      url: getUrl(),
      isEmbeddedInProduct: isEmbeddedInProduct,
      isInCMS: getQueryParam('isInCMS') === 'true',
      mode: getQueryParam('mode'),
      apiEnableWidgetCookieBanner: getQueryParam('enableWidgetCookieBanner')
    })
  });
  return buildStore(defaultStore, {
    getVisitorIdentityContext: function getVisitorIdentityContext() {
      return _getVisitorIdentityContext();
    }
  });
}

var store = startRedux();

var ReduxProvider = function ReduxProvider(_ref) {
  var children = _ref.children;
  var identityContext = useContext(VisitorIdentityContext);

  _getVisitorIdentityContext = function _getVisitorIdentityContext() {
    return identityContext;
  };

  return /*#__PURE__*/_jsx(Provider, {
    store: store,
    children: children
  });
};

ReduxProvider.displayName = 'ReduxProvider';
ReduxProvider.propTypes = {
  children: PropTypes.node
};
export default ReduxProvider;