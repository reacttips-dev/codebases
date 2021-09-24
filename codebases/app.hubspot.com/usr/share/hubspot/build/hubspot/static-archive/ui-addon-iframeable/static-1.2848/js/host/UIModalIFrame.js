'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement as _createElement } from "react";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component, Fragment, createRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import H2 from 'UIComponents/elements/headings/H2';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import UIModal from 'UIComponents/dialog/UIModal';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIOptimisticNanoProgress from 'UIComponents/progress/UIOptimisticNanoProgress';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import UIIFrame from './UIIFrame';
var DIALOG_DEFAULT_USE = 'default';
var FULLSCREEN = 'fullscreen';
var SIDEBAR = 'sidebar';
var PANEL = 'panel';
var PRELOAD_CONTAINER_ROOT_ID = 'ifr-private-preload-root';
var POS_ADJUST_INTERVAL = 100;
var MAX_POS_ADJUSTMENTS = 4000 / POS_ADJUST_INTERVAL;
var OUT_OF_MODAL_POSITIONING = {
  height: '',
  width: '',
  top: '',
  left: '',
  position: 'static',
  'z-index': ''
};
var IN_MODAL_POSITIONING = {
  position: 'absolute',
  'z-index': 1112
};
var FULL_MODAL_EMBED_IN_MODAL_POSITIONING = {
  height: '100vh',
  width: '100%'
};
var ContainerPositionRelative = styled('div').withConfig({
  displayName: "UIModalIFrame__ContainerPositionRelative",
  componentId: "sc-1di36j1-0"
})(["position:relative;width:100%;"]);

var toPx = function toPx(v) {
  return v + "px";
};

var getOffset = function getOffset(el) {
  var rect = el.getBoundingClientRect();
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    topToViewport: rect.top,
    left: rect.left + scrollLeft
  };
};

var getPreloadContainerRootEl = function getPreloadContainerRootEl() {
  var rootEl = document.getElementById(PRELOAD_CONTAINER_ROOT_ID);

  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.id = PRELOAD_CONTAINER_ROOT_ID;
    document.body.appendChild(rootEl);
  }

  return rootEl;
};

var createPreloadContainerEl = function createPreloadContainerEl() {
  var el = document.createElement('div');
  getPreloadContainerRootEl().appendChild(el);
  return el;
};

var _positionIFrameInModal = function positionIFrameInModal(iFrameContainerEl, modalEl) {
  var styles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!modalEl) {
    return;
  }

  var offset = getOffset(modalEl);
  var positioning = Object.assign({}, IN_MODAL_POSITIONING, {
    top: toPx(offset.top),
    left: toPx(offset.left),
    'max-width': toPx(modalEl.offsetWidth)
  });
  var computedFrameContainerStyles = Object.assign({}, positioning, {}, styles);
  var height = computedFrameContainerStyles.height;
  var topToViewport = offset.topToViewport;

  if (height && topToViewport > 0) {
    computedFrameContainerStyles.height = "calc(" + height + " - " + topToViewport + "px)";
  }

  Object.assign(iFrameContainerEl.style, computedFrameContainerStyles);
};

var _resetIFramePosition = function resetIFramePosition(iFrameContainerEl) {
  Object.assign(iFrameContainerEl.style, OUT_OF_MODAL_POSITIONING);
};

var UIModalIFrame = /*#__PURE__*/function (_Component) {
  _inherits(UIModalIFrame, _Component);

  _createClass(UIModalIFrame, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var preloadedIFrame = state.preloadedIFrame;

      if (props.preload && !preloadedIFrame) {
        preloadedIFrame = {
          placeholderRef: /*#__PURE__*/createRef(),
          el: createPreloadContainerEl()
        };
      }

      return {
        actionHandlers: props.actionButtons.reduce(function (acc, action) {
          acc[action.name] = function (evt) {
            // prevent clicks on buttons from propagating up to component rendering the modal
            evt.stopPropagation();
            state.handleAction(action.name);
          };

          return acc;
        }, {}),
        preloadedIFrame: preloadedIFrame
      };
    }
  }]);

  function UIModalIFrame() {
    var _this;

    _classCallCheck(this, UIModalIFrame);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIModalIFrame).call(this));
    _this.handleAction = _this.handleAction.bind(_assertThisInitialized(_this));
    _this.handleCloseModal = _this.handleCloseModal.bind(_assertThisInitialized(_this));
    _this.handleEsc = _this.handleEsc.bind(_assertThisInitialized(_this));
    _this.handleOnCloseComplete = _this.handleOnCloseComplete.bind(_assertThisInitialized(_this));
    _this.handleOnMessage = _this.handleOnMessage.bind(_assertThisInitialized(_this));
    _this.handleOnOpenComplete = _this.handleOnOpenComplete.bind(_assertThisInitialized(_this));
    _this.handleOnReady = _this.handleOnReady.bind(_assertThisInitialized(_this));
    _this.positionIFrameInModal = _this.positionIFrameInModal.bind(_assertThisInitialized(_this));
    _this.hostContext = null;
    _this.adjustPosition = {
      interval: null,
      count: 0
    };
    _this.state = {
      actionHandlers: null,
      handleAction: _this.handleAction,
      open: false,
      preloadedIFrame: null,
      ready: false
    };
    return _this;
  }

  _createClass(UIModalIFrame, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.preload && !this.props.preload) {
        this.resetIFramePosition();
        this.setState({
          ready: false
        });
      }

      if (this.props.preload) {
        if (this.props.show && !prevState.ready && this.state.ready) {
          this.positionIFrameInModal();
        }

        if (this.state.ready && (prevProps.height !== this.props.height || prevProps.width !== this.props.width)) {
          this.positionIFrameInModal();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.preload) {
        this.resetIFramePosition();
        this.state.preloadedIFrame.el.parentElement.removeChild(this.state.preloadedIFrame.el);
      }
    }
  }, {
    key: "isUseFullscreen",
    value: function isUseFullscreen() {
      return this.props.use === FULLSCREEN;
    }
  }, {
    key: "isUseSidebar",
    value: function isUseSidebar() {
      return this.props.use === SIDEBAR;
    }
  }, {
    key: "isUsePanel",
    value: function isUsePanel() {
      return this.props.use === PANEL;
    }
  }, {
    key: "isFullModalEmbed",
    value: function isFullModalEmbed() {
      return !this.hasFooter();
    }
  }, {
    key: "hasHeader",
    value: function hasHeader() {
      return this.props.title;
    }
  }, {
    key: "hasFooter",
    value: function hasFooter() {
      return this.props.actionButtons.length;
    }
  }, {
    key: "getIframePositioningStyles",
    value: function getIframePositioningStyles() {
      return this.isFullModalEmbed() ? FULL_MODAL_EMBED_IN_MODAL_POSITIONING : undefined;
    }
  }, {
    key: "positionIFrameInModal",
    value: function positionIFrameInModal() {
      _positionIFrameInModal(this.state.preloadedIFrame.el, this.state.preloadedIFrame.placeholderRef.current, this.getIframePositioningStyles());
    }
  }, {
    key: "stopAdjustingIFramePositioning",
    value: function stopAdjustingIFramePositioning() {
      clearInterval(this.adjustPosition.interval);
      this.adjustPosition.interval = null;
      this.adjustPosition.count = 0;
    }
  }, {
    key: "adjustIFramePositioning",
    value: function adjustIFramePositioning() {
      var _this2 = this;

      if (this.adjustPosition.interval) {
        return;
      }

      this.adjustPosition.interval = setInterval(function () {
        if (_this2.adjustPosition.count >= MAX_POS_ADJUSTMENTS || !_this2.props.preload || !_this2.props.show) {
          _this2.stopAdjustingIFramePositioning();

          return;
        }

        _this2.adjustPosition.count++;

        _this2.positionIFrameInModal();
      }, 100);
    }
  }, {
    key: "resetIFramePosition",
    value: function resetIFramePosition() {
      window.removeEventListener('resize', this.positionIFrameInModal);

      if (this.isUsePanel()) {
        window.removeEventListener('scroll', this.positionIFrameInModal);
      }

      this.stopAdjustingIFramePositioning();

      _resetIFramePosition(this.state.preloadedIFrame.el);
    }
  }, {
    key: "performIFramePositioning",
    value: function performIFramePositioning() {
      if (!this.props.preload || !this.props.show) {
        return;
      }

      this.positionIFrameInModal();
      this.adjustIFramePositioning();
      window.addEventListener('resize', this.positionIFrameInModal);

      if (this.isUsePanel()) {
        window.addEventListener('scroll', this.positionIFrameInModal);
      }
    }
  }, {
    key: "handleOnReady",
    value: function handleOnReady(hostContext, data) {
      this.hostContext = hostContext;
      this.props.onReady(hostContext, data);
      this.setState({
        ready: true
      });

      if (!this.state.open) {
        return;
      }

      this.performIFramePositioning();
    }
  }, {
    key: "handleModalClosed",
    value: function handleModalClosed(message) {
      var _this$props = this.props,
          onClose = _this$props.onClose,
          preload = _this$props.preload;

      if (!preload) {
        this.setState({
          ready: false
        });
      }

      onClose(message.payload);
    }
  }, {
    key: "handleOnMessage",
    value: function handleOnMessage(message) {
      var onMessage = this.props.onMessage;

      if (message.payload.type === MSG_TYPE_MODAL_DIALOG_CLOSE) {
        this.handleModalClosed(message);
      } else {
        onMessage(message);
      }
    }
  }, {
    key: "handleOnCloseComplete",
    value: function handleOnCloseComplete() {
      if (this.props.preload) {
        this.resetIFramePosition();
      }

      this.setState({
        open: false
      });
    }
  }, {
    key: "handleOnOpenComplete",
    value: function handleOnOpenComplete() {
      var onOpenComplete = this.props.onOpenComplete;

      if (onOpenComplete) {
        onOpenComplete();
      }

      this.setState({
        open: true
      });

      if (!this.state.ready) {
        return;
      }

      this.performIFramePositioning();
    }
  }, {
    key: "handleCloseModal",
    value: function handleCloseModal(evt) {
      // prevent clicks on close button from propagating up to component rendering the modal
      evt.stopPropagation();
      this.handleAction(MSG_TYPE_MODAL_DIALOG_CLOSE);
    }
  }, {
    key: "handleAction",
    value: function handleAction(action) {
      if (!this.hostContext) {
        return;
      }

      this.hostContext.sendMessage(action, {});
    }
  }, {
    key: "handleEsc",
    value: function handleEsc(evt) {
      var onEsc = this.props.onEsc;

      if (onEsc) {
        onEsc();
      }

      this.handleCloseModal(evt);
    }
  }, {
    key: "getHandlers",
    value: function getHandlers() {
      var _this$props2 = this.props,
          onEsc = _this$props2.onEsc,
          title = _this$props2.title,
          use = _this$props2.use;

      if (use === PANEL) {
        // UIPanel does not support an `onEsc` prop
        return {};
      }

      if (title) {
        return {
          onEsc: onEsc
        };
      }

      return {
        onEsc: this.handleEsc
      };
    }
  }, {
    key: "getModalComponent",
    value: function getModalComponent() {
      switch (this.props.use) {
        case SIDEBAR:
          return UIModalPanel;

        case PANEL:
          return UIPanel;

        default:
          return UIModal;
      }
    }
  }, {
    key: "getModalComponentProps",
    value: function getModalComponentProps() {
      var _this3 = this;

      var Modal = this.getModalComponent();
      return Object.keys(Modal.propTypes).reduce(function (acc, prop) {
        if (_this3.props.hasOwnProperty(prop)) {
          acc[prop] = _this3.props[prop];
        }

        return acc;
      }, {});
    }
  }, {
    key: "getModalComponentWidth",
    value: function getModalComponentWidth() {
      var width = parseInt(this.props.width, 10);

      if (isNaN(width)) {
        return this.props.width;
      }

      return this.isFullModalEmbed() ? width : width + 80;
    }
  }, {
    key: "getDialogBodyClassName",
    value: function getDialogBodyClassName() {
      var showingProgressIndicator = this.shouldRender(this.props.showProgressIndicator);
      return classNames('embedded-dialog', this.isFullModalEmbed() && (showingProgressIndicator ? 'in-full-loading' : 'in-full'), this.isUseSidebar() && "sidebar", this.isUsePanel() && "panel");
    }
  }, {
    key: "getIFrameDimensions",
    value: function getIFrameDimensions() {
      var fullyEmbedded = !(this.hasHeader() || this.hasFooter());
      var none;

      if (this.isUseFullscreen()) {
        none = !this.state.open || !fullyEmbedded && !this.props.show;
      } else {
        none = !this.props.show;
      }

      var height = this.isUseFullscreen() ? '100%' : this.props.height;
      var width = this.isUseFullscreen() ? '100%' : this.props.width;
      return {
        height: none ? 0 : height,
        width: none ? 0 : width
      };
    }
  }, {
    key: "shouldRender",
    value: function shouldRender(indicator) {
      return !this.state.ready && indicator;
    }
  }, {
    key: "renderIFrame",
    value: function renderIFrame() {
      var _this$props3 = this.props,
          __ab = _this$props3.actionButtons,
          __lip = _this$props3.loadingIndicatorProps,
          __p = _this$props3.preload,
          __pip = _this$props3.progressIndicatorProps,
          __sli = _this$props3.showLoadingIndicator,
          __spi = _this$props3.showProgressIndicator,
          __t = _this$props3.title,
          iframeProps = _objectWithoutProperties(_this$props3, ["actionButtons", "loadingIndicatorProps", "preload", "progressIndicatorProps", "showLoadingIndicator", "showProgressIndicator", "title"]);

      var dimensions = this.getIFrameDimensions();
      return /*#__PURE__*/_jsx(UIIFrame, Object.assign({}, iframeProps, {
        height: dimensions.height,
        onMessage: this.handleOnMessage,
        onReady: this.handleOnReady,
        width: dimensions.width
      }));
    }
  }, {
    key: "renderIFramePlaceholder",
    value: function renderIFramePlaceholder() {
      var _this$props4 = this.props,
          height = _this$props4.height,
          width = _this$props4.width;
      return /*#__PURE__*/_jsx("div", {
        ref: this.state.preloadedIFrame.placeholderRef,
        style: {
          height: height + "px",
          width: width + "px"
        }
      });
    }
  }, {
    key: "renderProgressIndicator",
    value: function renderProgressIndicator() {
      return /*#__PURE__*/_jsx(UIOptimisticNanoProgress, Object.assign({}, this.props.progressIndicatorProps));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      return /*#__PURE__*/_jsx(UILoadingOverlay, Object.assign({}, this.props.loadingIndicatorProps, {
        contextual: true
      }));
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      if (!this.hasHeader()) {
        return null;
      }

      var _this$props5 = this.props,
          title = _this$props5.title,
          use = _this$props5.use;
      var Header = use === PANEL ? UIPanelHeader : UIDialogHeader;
      return /*#__PURE__*/_jsxs(Header, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: this.handleCloseModal
        }), /*#__PURE__*/_jsx(H2, {
          children: title
        })]
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this$props6 = this.props,
          __ab = _this$props6.actionButtons,
          preload = _this$props6.preload,
          showLoadingIndicator = _this$props6.showLoadingIndicator,
          showProgressIndicator = _this$props6.showProgressIndicator,
          __t = _this$props6.title,
          use = _this$props6.use;
      var className = this.getDialogBodyClassName();
      var renderProgress = this.shouldRender(showProgressIndicator);
      var renderLoading = this.shouldRender(showLoadingIndicator);
      var Body = use === PANEL ? UIPanelBody : UIDialogBody;

      var content = /*#__PURE__*/_jsxs(Fragment, {
        children: [renderProgress && this.renderProgressIndicator(), /*#__PURE__*/_jsxs(ContainerPositionRelative, {
          children: [renderLoading && this.renderLoadingIndicator(), preload && this.renderIFramePlaceholder(), !preload && this.renderIFrame()]
        })]
      });

      if (use === PANEL) {
        if (this.isFullModalEmbed()) {
          return /*#__PURE__*/_jsx(Body, {
            className: className,
            children: content
          });
        }

        return /*#__PURE__*/_jsx(Body, {
          className: className,
          children: /*#__PURE__*/_jsx(UIPanelSection, {
            className: "display-flex",
            children: content
          })
        });
      }

      return /*#__PURE__*/_jsx(Body, {
        className: className,
        children: content
      });
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this4 = this;

      if (!this.hasFooter()) {
        return null;
      }

      var _this$props7 = this.props,
          actionButtons = _this$props7.actionButtons,
          use = _this$props7.use;
      var Footer = use === PANEL ? UIPanelFooter : UIDialogFooter;
      return /*#__PURE__*/_jsx(Footer, {
        children: actionButtons.map(function (_ref) {
          var name = _ref.name,
              label = _ref.label,
              _ref$props = _ref.props,
              props = _ref$props === void 0 ? {} : _ref$props;
          return /*#__PURE__*/_createElement(UIButton, Object.assign({}, props, {
            key: name,
            onClick: _this4.state.actionHandlers[name]
          }), label);
        })
      });
    }
  }, {
    key: "renderPreloadedIFrame",
    value: function renderPreloadedIFrame() {
      return /*#__PURE__*/createPortal(this.renderIFrame(), this.state.preloadedIFrame.el);
    }
  }, {
    key: "renderModal",
    value: function renderModal() {
      var Modal = this.getModalComponent();
      var handlers = this.getHandlers();
      var width = this.getModalComponentWidth();
      var modalProps = this.getModalComponentProps();
      return /*#__PURE__*/_jsxs(Modal, Object.assign({}, modalProps, {}, handlers, {
        onCloseComplete: this.handleOnCloseComplete,
        onOpenComplete: this.handleOnOpenComplete,
        width: width,
        children: [this.renderHeader(), this.renderBody(), this.renderFooter()]
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          preload = _this$props8.preload,
          show = _this$props8.show;

      if (!preload) {
        return show && this.renderModal();
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [preload && this.renderPreloadedIFrame(), show && this.renderModal()]
      });
    }
  }]);

  return UIModalIFrame;
}(Component);

UIModalIFrame.propTypes = Object.assign({}, UIModal.propTypes, {}, UIIFrame.propTypes, {
  actionButtons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    props: PropTypes.object
  })).isRequired,
  loadingIndicatorProps: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  preload: PropTypes.bool.isRequired,
  progressIndicatorProps: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  showLoadingIndicator: PropTypes.bool.isRequired,
  showProgressIndicator: PropTypes.bool.isRequired,
  title: PropTypes.string,
  use: PropTypes.oneOfType([UIModal.propTypes.use, PropTypes.oneOf([SIDEBAR, PANEL])]).isRequired
});
UIModalIFrame.defaultProps = Object.assign({}, UIModal.defaultProps, {}, UIIFrame.defaultProps, {
  actionButtons: [],
  loadingIndicatorProps: {},
  preload: false,
  progressIndicatorProps: {
    value: 5
  },
  show: true,
  showLoadingIndicator: false,
  showProgressIndicator: false,
  use: DIALOG_DEFAULT_USE
});
export default UIModalIFrame;
export var UIModalIFrameWithRef = /*#__PURE__*/forwardRef(function (props, ref) {
  return /*#__PURE__*/_jsx(UIModalIFrame, Object.assign({}, props, {
    innerRef: ref
  }));
});