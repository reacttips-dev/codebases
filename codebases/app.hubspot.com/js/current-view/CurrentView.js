'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Suspense, PureComponent } from 'react';
import { THREAD_VIEW, THREAD_LIST, KNOWLEDGE_BASE } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import Views from 'conversations-visitor-experience-components/visitor-widget/proptypes/WidgetViews';
import WidgetPlaceholder from 'conversations-visitor-experience-components/visitor-widget/components/WidgetPlaceholder';
import VisitorWidgetContainer from '../visitor-widget/containers/VisitorWidgetContainer';
import { lazyWithPreload } from '../utils/lazyWithPreload';
import FadeSlideInTransition from '../transition/FadeSlideInTransition';
import { withBrowserSizeContext } from '../containers/withBrowserSizeContext';
export var CurrentView = /*#__PURE__*/function (_PureComponent) {
  _inherits(CurrentView, _PureComponent);

  function CurrentView(props) {
    var _this;

    _classCallCheck(this, CurrentView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CurrentView).call(this, props));
    _this.ThreadView = lazyWithPreload(function () {
      return import(
      /* webpackChunkName: "CurrentView-ThreadView" */
      '../components/ThreadView');
    });
    _this.KnowledgeBaseContainer = lazyWithPreload(function () {
      return import(
      /* webpackChunkName: "CurrentView-KnowledgeBaseContainer" */
      '../knowledge-base/components/KnowledgeBaseContainer');
    });
    _this.ThreadListContainer = lazyWithPreload(function () {
      return import(
      /* webpackChunkName: "CurrentView-ThreadListContainer" */
      '../containers/ThreadListContainer');
    });
    return _this;
  }

  _createClass(CurrentView, [{
    key: "renderView",
    value: function renderView() {
      var currentView = this.props.currentView;

      if (!currentView) {
        return null;
      }

      switch (currentView) {
        case THREAD_VIEW:
          return /*#__PURE__*/_jsx(this.ThreadView, {});

        case KNOWLEDGE_BASE:
          return /*#__PURE__*/_jsx(this.KnowledgeBaseContainer, {});

        case THREAD_LIST:
          return /*#__PURE__*/_jsx(this.ThreadListContainer, {});

        default:
          {
            return /*#__PURE__*/_jsx(WidgetPlaceholder, {});
          }
      }
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this$props = this.props,
          closeWidget = _this$props.closeWidget,
          browserWindowHeight = _this$props.browserWindowHeight,
          inline = _this$props.inline,
          currentView = _this$props.currentView;
      return /*#__PURE__*/_jsx("div", {
        style: {
          height: '100%'
        },
        id: "current-view-component",
        children: /*#__PURE__*/_jsx(VisitorWidgetContainer, {
          browserWindowHeight: browserWindowHeight,
          closeWidget: closeWidget,
          inline: inline,
          view: currentView,
          children: /*#__PURE__*/_jsx(Suspense, {
            fallback: /*#__PURE__*/_jsx(WidgetPlaceholder, {}),
            children: this.renderView()
          })
        })
      }, "widget");
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          onOpenAnimationStarted = _this$props2.onOpenAnimationStarted,
          onCloseAnimationStarted = _this$props2.onCloseAnimationStarted,
          onOpenAnimationFinished = _this$props2.onOpenAnimationFinished,
          onCloseAnimationFinished = _this$props2.onCloseAnimationFinished,
          isOpen = _this$props2.isOpen,
          mobile = _this$props2.mobile;
      return /*#__PURE__*/_jsx(FadeSlideInTransition, {
        disabled: mobile,
        duration: 500,
        in: isOpen,
        onEnter: onOpenAnimationStarted,
        onEntered: onOpenAnimationFinished,
        onExit: onCloseAnimationStarted,
        onExited: onCloseAnimationFinished,
        children: this.renderContent()
      });
    }
  }]);

  return CurrentView;
}(PureComponent);
CurrentView.displayName = 'CurrentView';
CurrentView.defaultProps = {
  onAnimationsFinished: function onAnimationsFinished() {},
  onAnimationsStarted: function onAnimationsStarted() {}
};
CurrentView.propTypes = {
  browserWindowHeight: PropTypes.number.isRequired,
  closeWidget: PropTypes.func.isRequired,
  currentView: Views,
  inline: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool,
  mobile: PropTypes.bool,
  onCloseAnimationFinished: PropTypes.func,
  onCloseAnimationStarted: PropTypes.func,
  onOpenAnimationFinished: PropTypes.func,
  onOpenAnimationStarted: PropTypes.func
};
export default withBrowserSizeContext(CurrentView);