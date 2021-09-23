'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { WidgetLocationProp, LEFT_ALIGNED, RIGHT_ALIGNED } from 'conversations-visitor-experience-components/visitor-widget/constants/WidgetLocations';
import LauncherContainer from '../launcher/container/LauncherContainer';
import InitialMessageBubbleContainer from '../initial-message-bubble/containers/InitialMessageBubbleContainer';
import DebugOverlay from 'conversations-error-reporting/debug-overlay/DebugOverlay';
import WidgetErrorRetryPanel from './WidgetErrorRetryPanel';
import AsyncComponentErrorBoundary from '../code-splitting/AsyncComponentErrorBoundary';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import { SMALL, MEDIUM } from 'visitor-ui-component-library/constants/sizes';
import { calculateChatWidgetHeight } from 'conversations-visitor-experience-components/widget-dimensions/calculateChatWidgetHeight';
import CurrentViewContainer from '../current-view/CurrentViewContainer';
import { withBrowserSizeContext } from '../containers/withBrowserSizeContext';
import { BASE_WIDGET_WIDTH, BASE_WIDGET_HEIGHT, OFFSET_HEIGHT, WIDGET_SHADOW_WIDTH, LAUNCHER_WIDTH, LAUNCHER_HEIGHT } from 'conversations-visitor-experience-components/widget-dimensions/constants/dimensions';
export var ApplicationLayout = /*#__PURE__*/function (_Component) {
  _inherits(ApplicationLayout, _Component);

  function ApplicationLayout(props) {
    var _this;

    _classCallCheck(this, ApplicationLayout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ApplicationLayout).call(this, props));

    _this.onOpenAnimationStarted = function () {
      _this.setState({
        animationsFinished: false
      });

      _this.props.onIframeResize(_this.getIframeDimensions());
    };

    _this.onOpenAnimationFinished = function () {
      _this.setState({
        animationsFinished: true
      });
    };

    _this.onCloseAnimationStarted = function () {
      _this.setState({
        animationsFinished: false
      });
    };

    _this.onCloseAnimationFinished = function () {
      _this.setState({
        animationsFinished: true
      });

      _this.props.onIframeResize(_this.getIframeDimensions());
    };

    _this.getIframeDimensions = _this.getIframeDimensions.bind(_assertThisInitialized(_this));
    _this.getAvatarHeightAboveBubble = _this.getAvatarHeightAboveBubble.bind(_assertThisInitialized(_this));
    _this.setInitialMessageRef = _this.setInitialMessageRef.bind(_assertThisInitialized(_this));
    _this.openWidget = _this.openWidget.bind(_assertThisInitialized(_this));
    _this.closeWidget = _this.closeWidget.bind(_assertThisInitialized(_this));
    _this.getLauncherBoundingRect = _this.getLauncherBoundingRect.bind(_assertThisInitialized(_this));
    _this.getInitialMessageBoundingRect = _this.getInitialMessageBoundingRect.bind(_assertThisInitialized(_this));
    _this.getWidgetBoundingRect = _this.getWidgetBoundingRect.bind(_assertThisInitialized(_this));
    _this.state = {
      animationsFinished: true
    };
    return _this;
  }

  _createClass(ApplicationLayout, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onIframeResize(this.getIframeDimensions(this.props.isOpen));
    }
  }, {
    key: "getLauncherBoundingRect",
    value: function getLauncherBoundingRect() {
      var _this$props = this.props,
          isOpen = _this$props.isOpen,
          inline = _this$props.inline,
          mobile = _this$props.mobile;
      var launcherHidden = isOpen && mobile || inline;
      return launcherHidden ? {
        width: 0,
        height: 0
      } : {
        width: LAUNCHER_WIDTH,
        height: LAUNCHER_HEIGHT
      };
    }
  }, {
    key: "getInitialMessageBoundingRect",
    value: function getInitialMessageBoundingRect() {
      return this.initialMessageRef ? this.initialMessageRef.getBoundingClientRect() : {
        width: 0,
        height: 0
      };
    }
  }, {
    key: "getWidgetBoundingRect",
    value: function getWidgetBoundingRect() {
      var isOpen = this.props.isOpen;
      return isOpen ? {
        width: BASE_WIDGET_WIDTH + WIDGET_SHADOW_WIDTH,
        height: calculateChatWidgetHeight(this.props.browserWindowHeight, false)
      } : {
        width: 0,
        height: 0
      };
    }
  }, {
    key: "getAvatarHeightAboveBubble",
    value: function getAvatarHeightAboveBubble() {
      var avatarHeightPx = this.props.mobile ? AVATAR_SIZES[SMALL] : AVATAR_SIZES[MEDIUM];
      return avatarHeightPx / 2;
    }
  }, {
    key: "getIframeDimensions",
    value: function getIframeDimensions(forceOpen) {
      var MARGIN_PX = 16;
      var _this$props2 = this.props,
          mobile = _this$props2.mobile,
          _isOpen = _this$props2.isOpen;
      var isOpen = forceOpen || _isOpen; // open widget on mobile takes up the entire screen

      if (isOpen && mobile) {
        return {
          height: this.props.browserWindowHeight,
          width: this.props.browserWindowWidth
        };
      }

      if (isOpen) {
        return {
          height: BASE_WIDGET_HEIGHT + LAUNCHER_HEIGHT + OFFSET_HEIGHT,
          width: BASE_WIDGET_WIDTH + WIDGET_SHADOW_WIDTH
        };
      }

      var activeContent = this.getInitialMessageBoundingRect();
      var launcher = this.getLauncherBoundingRect();
      var avatarHeightAboveBubble = activeContent.height ? this.getAvatarHeightAboveBubble() : 0;
      return {
        width: (activeContent.width || launcher.width) + MARGIN_PX,
        height: launcher.height + activeContent.height + MARGIN_PX + avatarHeightAboveBubble
      };
    }
  }, {
    key: "setInitialMessageRef",
    value: function setInitialMessageRef(element) {
      this.initialMessageRef = findDOMNode(element);

      if (this.state.animationsFinished) {
        this.props.onIframeResize(this.getIframeDimensions());
      }
    }
  }, {
    key: "openWidget",
    value: function openWidget() {
      var _this2 = this;

      this.setState({
        animationsFinished: false
      });
      this.props.trackUserInteraction();
      this.props.onIframeResize(this.getIframeDimensions(true));
      setTimeout(function () {
        _this2.props.toggleOpen({
          isOpened: true,
          isUser: true
        });
      }, 50);
    }
  }, {
    key: "closeWidget",
    value: function closeWidget() {
      this.setState({
        animationsFinished: false
      });
      this.props.trackUserInteraction();
      this.props.toggleOpen({
        isOpened: false,
        isUser: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _launcherAlignmentCla,
          _this3 = this;

      var _this$props3 = this.props,
          isOpen = _this$props3.isOpen,
          inline = _this$props3.inline,
          mobile = _this$props3.mobile,
          onLauncherHover = _this$props3.onLauncherHover,
          showInitialMessageBubble = _this$props3.showInitialMessageBubble,
          widgetLocation = _this$props3.widgetLocation;
      var launcherHidden = isOpen && mobile || inline;
      var launcherAlignmentClasses = (_launcherAlignmentCla = {}, _defineProperty(_launcherAlignmentCla, LEFT_ALIGNED, 'p-right-6 launcher-left-align'), _defineProperty(_launcherAlignmentCla, RIGHT_ALIGNED, 'p-left-6 launcher-right-align'), _launcherAlignmentCla);
      var launcherWrapperClasses = classNames("p-top-5 display-flex", launcherAlignmentClasses[widgetLocation]);
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(AsyncComponentErrorBoundary, {
          renderError: function renderError(retry) {
            return /*#__PURE__*/_jsx(WidgetErrorRetryPanel, {
              inline: inline,
              isOpen: isOpen,
              mobile: mobile,
              widgetLocation: widgetLocation,
              onClose: _this3.closeWidget,
              retry: retry
            });
          },
          children: /*#__PURE__*/_jsx(CurrentViewContainer, {
            inline: inline,
            isOpen: isOpen,
            mobile: mobile,
            onOpenAnimationStarted: this.onOpenAnimationStarted,
            onCloseAnimationFinished: this.onCloseAnimationFinished,
            onOpenAnimationFinished: this.onOpenAnimationFinished,
            onCloseAnimationStarted: this.onCloseAnimationStarted,
            widgetLocation: widgetLocation,
            closeWidget: this.closeWidget
          })
        }), showInitialMessageBubble && this.state.animationsFinished && /*#__PURE__*/_jsx(InitialMessageBubbleContainer, {
          avatarHeightAboveBubble: this.getAvatarHeightAboveBubble(),
          onIframeResize: function onIframeResize() {
            _this3.props.onIframeResize(_this3.getIframeDimensions());
          },
          setInitialMessageRef: this.setInitialMessageRef,
          onClick: this.openWidget,
          widgetLocation: widgetLocation
        }), !launcherHidden && /*#__PURE__*/_jsx("span", {
          "data-test-id": 'chat-widget-launcher',
          className: launcherWrapperClasses,
          onMouseOver: onLauncherHover,
          children: /*#__PURE__*/_jsx(LauncherContainer, {
            onClose: this.closeWidget,
            onOpen: this.openWidget
          })
        }), /*#__PURE__*/_jsx(DebugOverlay, {
          onEnterDebug: this.openWidget
        })]
      });
    }
  }]);

  return ApplicationLayout;
}(Component);
ApplicationLayout.displayName = 'ApplicationLayout';
ApplicationLayout.propTypes = {
  browserWindowHeight: PropTypes.number.isRequired,
  browserWindowWidth: PropTypes.number,
  inline: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  onIframeResize: PropTypes.func.isRequired,
  onLauncherHover: PropTypes.func.isRequired,
  showInitialMessageBubble: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
  trackUserInteraction: PropTypes.func.isRequired,
  widgetLocation: WidgetLocationProp
};
export default withBrowserSizeContext(ApplicationLayout);