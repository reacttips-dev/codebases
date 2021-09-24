'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _WidgetLocationStyles;

import PropTypes from 'prop-types';
import { Component } from 'react';
import styled, { css } from 'styled-components';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { isHidden } from 'conversations-visibility-tools/visibility/isHidden';
import { addVisibilityChangeListener } from 'conversations-visibility-tools/visibility/addVisibilityChangeListener';
import { removeVisibilityChangeListener } from 'conversations-visibility-tools/visibility/removeVisibilityChangeListener';
import { WidgetLocationProp, LEFT_ALIGNED, RIGHT_ALIGNED } from 'conversations-visitor-experience-components/visitor-widget/constants/WidgetLocations';
import { WIDGET_DATA, REFRESH_WIDGET_DATA, REQUEST_OPEN, REQUEST_CLOSE, BROWSER_WINDOW_RESIZE, SCROLL_PERCENTAGE_CHANGE, EXIT_INTENT, PERF_ATTRIBUTES, HUBSPOT_UTK, GLOBAL_COOKIE_OPT_OUT, FIRST_VISITOR_SESSION, TRACK_API_USAGE, OPEN_TO_NEW_THREAD } from '../constants/PostMessageTypes';
import { buildWidgetData } from '../widget-data/operators/buildWidgetData';
import { getIsPortal53 } from '../widget-data/operators/getIsPortal53';
import ApplicationLayout from './ApplicationLayout';
import CheckerContainer from '../react-rhumb/containers/CheckerContainer';
import ThemeProvider from './ThemeProvider';
import { trackApiInteraction } from '../usage-tracking/utils/trackApiInteraction';
import { handleIframeResize } from '../post-message/handleIframeResize';
import { handleRequestWidget } from '../post-message/handleRequestWidget';
import { defaultBrowserWindowContext, BrowserWindowContext } from './BrowserWindowContext';
import { setHubspotUtk } from '../query-params/hubspotUtk';
var WidgetLocationStyles = (_WidgetLocationStyles = {}, _defineProperty(_WidgetLocationStyles, LEFT_ALIGNED, css(["padding-left:16px;padding-right:0;left:0;right:inherit;"])), _defineProperty(_WidgetLocationStyles, RIGHT_ALIGNED, css(["padding-left:0;padding-right:16px;left:inherit;right:0;"])), _WidgetLocationStyles);
var WidgetAppContainer = styled.div.withConfig({
  displayName: "Application__WidgetAppContainer",
  componentId: "sc-1f2l0a1-0"
})(["&.inline{height:100%;width:100%;padding:0;}", ""], function (_ref) {
  var widgetLocation = _ref.widgetLocation;
  return WidgetLocationStyles[widgetLocation];
});

var Application = /*#__PURE__*/function (_Component) {
  _inherits(Application, _Component);

  function Application(props) {
    var _this;

    _classCallCheck(this, Application);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Application).call(this, props));
    _this.handleDragover = _this.handleDragover.bind(_assertThisInitialized(_this));
    _this.handleDrop = _this.handleDrop.bind(_assertThisInitialized(_this));
    _this.registerDragDropHandlers = _this.registerDragDropHandlers.bind(_assertThisInitialized(_this));
    _this.unregisterDragDropHandlers = _this.unregisterDragDropHandlers.bind(_assertThisInitialized(_this));
    _this.handleVisibilityChange = _this.handleVisibilityChange.bind(_assertThisInitialized(_this));
    _this.registerContainerRef = _this.registerContainerRef.bind(_assertThisInitialized(_this));
    _this.getIframeDimensions = _this.getIframeDimensions.bind(_assertThisInitialized(_this));
    _this.onIframeResize = _this.onIframeResize.bind(_assertThisInitialized(_this));
    _this.onOpenUpdate = _this.onOpenUpdate.bind(_assertThisInitialized(_this));
    _this.requestWidget = _this.requestWidget.bind(_assertThisInitialized(_this));
    _this.onBrowserWindowResize = _this.onBrowserWindowResize.bind(_assertThisInitialized(_this));
    _this.onScrollPercentageChange = _this.onScrollPercentageChange.bind(_assertThisInitialized(_this));
    _this.onExitIntent = _this.onExitIntent.bind(_assertThisInitialized(_this));
    _this.receiveMessage = _this.receiveMessage.bind(_assertThisInitialized(_this));
    _this.renderContent = _this.renderContent.bind(_assertThisInitialized(_this));
    _this.openToNewThread = _this.openToNewThread.bind(_assertThisInitialized(_this));
    _this.state = {
      // initially assume the browser is big enough to fit the whole widget
      // then shrink as needed after first paint
      browserWindowHeight: defaultBrowserWindowContext.browserWindowHeight,
      browserWindowWidth: defaultBrowserWindowContext.browserWindowWidth
    };
    return _this;
  }

  _createClass(Application, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.requestWidget();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('message', this.receiveMessage, false);
      this.registerDragDropHandlers();
      this.onIframeResize();

      if (isHidden()) {
        this.props.setWindowVisible(false);
      }

      addVisibilityChangeListener(this.handleVisibilityChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('message', this.receiveMessage);
      this.unregisterDragDropHandlers();
      removeVisibilityChangeListener(this.handleVisibilityChange);
    }
  }, {
    key: "handleDragover",
    value: function handleDragover(event) {
      event.preventDefault();
    }
  }, {
    key: "handleDrop",
    value: function handleDrop(event) {
      event.preventDefault();
    }
  }, {
    key: "registerDragDropHandlers",
    value: function registerDragDropHandlers() {
      window.addEventListener('dragover', this.handleDragover);
      window.addEventListener('drop', this.handleDrop);
    }
  }, {
    key: "unregisterDragDropHandlers",
    value: function unregisterDragDropHandlers() {
      window.removeEventListener('dragover', this.handleDragover);
      window.removeEventListener('drop', this.handleDrop);
    }
  }, {
    key: "handleVisibilityChange",
    value: function handleVisibilityChange(_ref2) {
      var isVisible = _ref2.isVisible;
      this.props.setWindowVisible(isVisible);
    }
  }, {
    key: "registerContainerRef",
    value: function registerContainerRef(element) {
      this.containerRef = element ? findDOMNode(element) : null;
    }
  }, {
    key: "getIframeDimensions",
    value: function getIframeDimensions() {
      var dimensions = this.containerRef ? this.containerRef.getBoundingClientRect() : {};
      var width = dimensions.width,
          height = dimensions.height;
      return {
        width: width,
        height: height
      };
    }
  }, {
    key: "onIframeResize",
    value: function onIframeResize(size) {
      handleIframeResize(size || this.getIframeDimensions());
    }
  }, {
    key: "onOpenUpdate",
    value: function onOpenUpdate(isOpened) {
      this.props.toggleOpen({
        isOpened: isOpened
      });
    }
  }, {
    key: "requestWidget",
    value: function requestWidget() {
      handleRequestWidget();
    }
  }, {
    key: "onBrowserWindowResize",
    value: function onBrowserWindowResize(data) {
      this.setState({
        browserWindowHeight: data.height,
        browserWindowWidth: data.width
      });
    }
  }, {
    key: "onScrollPercentageChange",
    value: function onScrollPercentageChange(data) {
      this.props.handleScrollPercentageChange({
        scrollPercentage: data.scrollPercentage
      });
    }
  }, {
    key: "onExitIntent",
    value: function onExitIntent() {
      this.props.executeExitIntentTrigger();
    }
  }, {
    key: "onTrackApiUsage",
    value: function onTrackApiUsage(data) {
      trackApiInteraction(data.eventName, data.properties);
    }
  }, {
    key: "openToNewThread",
    value: function openToNewThread() {
      if (!this.props.isViewingStubbedThread) {
        this.props.loadStagedThread();
      }
    }
  }, {
    key: "handleReceiveWidgetData",
    value: function handleReceiveWidgetData(widgetData) {
      var _this$props = this.props,
          handleReceiveWidgetData = _this$props.handleReceiveWidgetData,
          visitorIdentity = _this$props.visitorIdentity;
      visitorIdentity.setIsPrivateWidgetLoad(widgetData.privateLoad);
      handleReceiveWidgetData({
        data: widgetData,
        isFirstVisitorSession: visitorIdentity.getIsFirstVisitorSession()
      });
    }
  }, {
    key: "receiveMessage",
    value: function receiveMessage(_ref3) {
      var rawData = _ref3.data;
      var parsedData = null;

      try {
        parsedData = JSON.parse(rawData);
      } catch (err) {
        // unparseable / unexpected message format
        return;
      }

      var _parsedData = parsedData,
          _parsedData$type = _parsedData.type,
          type = _parsedData$type === void 0 ? null : _parsedData$type,
          _parsedData$data = _parsedData.data,
          data = _parsedData$data === void 0 ? null : _parsedData$data;

      switch (type) {
        case PERF_ATTRIBUTES:
          {
            if (window.newrelic && window.newrelic.addPageAction && data.perfAttributes) {
              window.newrelic.addPageAction('embedScriptPerfAttributes', data.perfAttributes);
            }

            break;
          }

        case WIDGET_DATA:
          this.handleReceiveWidgetData(data);
          break;

        case HUBSPOT_UTK:
          setHubspotUtk(data.utk);
          break;

        case GLOBAL_COOKIE_OPT_OUT:
          this.props.onGlobalCookieOptOut(data.globalCookieOptOut);
          break;

        case FIRST_VISITOR_SESSION:
          this.props.updateIsFirstVisitorSession(data.isFirstVisitorSession);
          this.props.visitorIdentity.setIsFirstVisitorSession(data.isFirstVisitorSession);
          break;

        case REFRESH_WIDGET_DATA:
          this.props.refreshWidgetData(buildWidgetData(parsedData.data));
          break;

        case REQUEST_OPEN:
          this.onOpenUpdate(true);
          break;

        case REQUEST_CLOSE:
          this.onOpenUpdate(false);
          break;

        case BROWSER_WINDOW_RESIZE:
          this.onBrowserWindowResize(data);
          break;

        case SCROLL_PERCENTAGE_CHANGE:
          this.onScrollPercentageChange(data);
          break;

        case EXIT_INTENT:
          this.onExitIntent();
          break;

        case TRACK_API_USAGE:
          this.onTrackApiUsage(data);
          break;

        case OPEN_TO_NEW_THREAD:
          this.openToNewThread();
          break;

        default:
          break;
      }
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this$props2 = this.props,
          inline = _this$props2.inline,
          isOpen = _this$props2.isOpen,
          mobile = _this$props2.mobile,
          onLauncherHover = _this$props2.onLauncherHover,
          showInitialMessageBubble = _this$props2.showInitialMessageBubble,
          toggleOpen = _this$props2.toggleOpen,
          trackUserInteraction = _this$props2.trackUserInteraction,
          widgetLocation = _this$props2.widgetLocation;
      return /*#__PURE__*/_jsx(BrowserWindowContext.Provider, {
        value: {
          browserWindowHeight: this.state.browserWindowHeight,
          browserWindowWidth: this.state.browserWindowWidth
        },
        children: /*#__PURE__*/_jsx(ApplicationLayout, {
          inline: inline,
          isOpen: isOpen,
          mobile: mobile,
          onLauncherHover: onLauncherHover,
          onIframeResize: this.onIframeResize,
          showInitialMessageBubble: showInitialMessageBubble,
          toggleOpen: toggleOpen,
          trackUserInteraction: trackUserInteraction,
          widgetLocation: widgetLocation
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var shouldRenderContent = this.props.shouldRenderContent;
      var isPortal53 = getIsPortal53();
      var classes = classNames('widget-app-container', this.props.inline && "inline", isPortal53 && 'hs-portal-font');
      return /*#__PURE__*/_jsxs(WidgetAppContainer, {
        ref: this.registerContainerRef,
        className: classes,
        widgetLocation: this.props.widgetLocation,
        children: [/*#__PURE__*/_jsx(CheckerContainer, {}), /*#__PURE__*/_jsx(ThemeProvider, {
          children: shouldRenderContent ? this.renderContent() : null
        })]
      });
    }
  }]);

  return Application;
}(Component);

Application.displayName = 'Application';
Application.contextType = BrowserWindowContext;
Application.propTypes = {
  executeExitIntentTrigger: PropTypes.func.isRequired,
  handleReceiveWidgetData: PropTypes.func.isRequired,
  handleScrollPercentageChange: PropTypes.func.isRequired,
  inline: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isViewingStubbedThread: PropTypes.bool.isRequired,
  loadStagedThread: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  onGlobalCookieOptOut: PropTypes.func.isRequired,
  onLauncherHover: PropTypes.func.isRequired,
  refreshWidgetData: PropTypes.func.isRequired,
  setWindowVisible: PropTypes.func.isRequired,
  shouldRenderContent: PropTypes.bool.isRequired,
  showInitialMessageBubble: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
  trackUserInteraction: PropTypes.func.isRequired,
  updateIsFirstVisitorSession: PropTypes.func.isRequired,
  visitorIdentity: PropTypes.object.isRequired,
  widgetLocation: WidgetLocationProp
};
export default Application;