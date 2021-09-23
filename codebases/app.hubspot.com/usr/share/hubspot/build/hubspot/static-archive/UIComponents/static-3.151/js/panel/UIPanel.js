'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Component } from 'react';
import memoizeOne from 'react-utils/memoizeOne';
import { Provider as PanelComponentRegistrationProvider } from '../context/PanelComponentRegistrationContext';
import * as PanelContext from '../context/PanelContext';
import { constrainVerticalWheelEvent } from '../core/EventHandlers';
import ShareScrollElement from '../decorators/ShareScrollElement';
import UILayer from '../layer/UILayer';
import refObject from '../utils/propTypes/refObject';
import { percentToVW } from '../utils/Styles';
import PanelTransition from './internal/PanelTransition';
import { getPanelTransitionProps } from './internal/panelUtils';
import { DropdownContextComponent } from '../context/DropdownContext';
var inPanelContext = {
  inPanel: true
};

var getStyle = function getStyle(style, computedWidth) {
  return Object.assign({}, style, {
    width: computedWidth
  });
};

var getClassName = function getClassName(align, className, sandboxed) {
  return classNames(className, 'private-panel', sandboxed && 'private-panel--sandboxed', {
    'left': 'private-panel--left',
    'right': 'private-panel--right'
  }[align]);
};

var getPanelClassName = function getPanelClassName(panelClassName, bodyCount, headerCount) {
  return classNames(panelClassName, 'private-panel__container', bodyCount > 0 && 'private-panel__container--with-body', headerCount > 0 && 'private-panel__container--with-header');
};

var UIPanel = /*#__PURE__*/function (_Component) {
  _inherits(UIPanel, _Component);

  function UIPanel(props) {
    var _this;

    _classCallCheck(this, UIPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIPanel).call(this, props));

    _this.handleWheel = function (evt) {
      // Allow a custom wheel handler to override this one
      var _this$props = _this.props,
          onWheel = _this$props.onWheel,
          scrollElementRef = _this$props.scrollElementRef;

      if (typeof onWheel === 'function') {
        onWheel(evt);
        return;
      }

      constrainVerticalWheelEvent(evt, scrollElementRef.current);
    };

    _this.state = {
      bodyCount: 0,
      headerCount: 0
    };
    _this._getStyle = memoizeOne(getStyle);
    _this._getTransitionProps = memoizeOne(getPanelTransitionProps);
    _this._isMounted = true; // Not technically, but child context funcs are called before didMount.

    _this._hasHeader = false;
    _this._hasBody = false; // Track the number of UIPanelHeader and UIPanelBody instances this panel contains. This code
    // should be removed once all headerless/bodyless panels are eliminated.

    _this._panelComponentRegistrationContextValue = {
      registerPanelBody: function registerPanelBody() {
        _this._hasBody = true;

        if (_this._isMounted) {
          _this.setState(function (state) {
            return {
              bodyCount: state.bodyCount + 1
            };
          });
        }
      },
      unregisterPanelBody: function unregisterPanelBody() {
        if (_this._isMounted) {
          _this.setState(function (state) {
            return {
              bodyCount: state.bodyCount - 1
            };
          });
        }
      },
      registerPanelHeader: function registerPanelHeader() {
        _this._hasHeader = true;

        if (_this._isMounted) {
          _this.setState(function (state) {
            return {
              headerCount: state.headerCount + 1
            };
          });
        }
      },
      unregisterPanelHeader: function unregisterPanelHeader() {
        if (_this._isMounted) {
          _this.setState(function (state) {
            return {
              headerCount: state.headerCount - 1
            };
          });
        }
      }
    };
    return _this;
  }

  _createClass(UIPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var scrollElementRef = this.props.scrollElementRef; // Using the React `onWheel` event would be restrictive in Chrome (#6272)

      scrollElementRef.current.addEventListener('wheel', this.handleWheel);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          align = _this$props2.align,
          animate = _this$props2.animate,
          children = _this$props2.children,
          className = _this$props2.className,
          onOpenStart = _this$props2.onOpenStart,
          onOpenComplete = _this$props2.onOpenComplete,
          onCloseStart = _this$props2.onCloseStart,
          onCloseComplete = _this$props2.onCloseComplete,
          __onWheel = _this$props2.onWheel,
          panelClassName = _this$props2.panelClassName,
          __panelKey = _this$props2.panelKey,
          rootNode = _this$props2.rootNode,
          scrollElementRef = _this$props2.scrollElementRef,
          style = _this$props2.style,
          width = _this$props2.width,
          _dontMakeNewLayer = _this$props2._dontMakeNewLayer,
          rest = _objectWithoutProperties(_this$props2, ["align", "animate", "children", "className", "onOpenStart", "onOpenComplete", "onCloseStart", "onCloseComplete", "onWheel", "panelClassName", "panelKey", "rootNode", "scrollElementRef", "style", "width", "_dontMakeNewLayer"]);

      var _this$state = this.state,
          bodyCount = _this$state.bodyCount,
          headerCount = _this$state.headerCount;
      var sandboxed = this.context.sandboxed;
      var computedWidth = (style || {}).width || width;
      computedWidth = percentToVW(computedWidth);

      var renderedPanel = /*#__PURE__*/_jsx(PanelContext.Provider, {
        value: inPanelContext,
        children: /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
          className: getClassName(align, className, sandboxed),
          ref: scrollElementRef,
          style: this._getStyle(style, computedWidth),
          children: /*#__PURE__*/_jsxs(PanelComponentRegistrationProvider, {
            value: this._panelComponentRegistrationContextValue,
            children: [/*#__PURE__*/_jsx("div", {
              className: getPanelClassName(panelClassName, bodyCount, headerCount),
              children: children
            }), /*#__PURE__*/_jsx(DropdownContextComponent, {
              componentName: UIPanel.displayName
            })]
          })
        }))
      });

      if (_dontMakeNewLayer || sandboxed) {
        return renderedPanel;
      }

      return /*#__PURE__*/_jsx(UILayer, {
        "data-layer-for": "UIPanel",
        rootNode: rootNode,
        Transition: PanelTransition,
        transitionProps: this._getTransitionProps(onOpenStart, onOpenComplete, onCloseStart, onCloseComplete, align, animate),
        children: renderedPanel
      });
    }
  }]);

  return UIPanel;
}(Component);

UIPanel.propTypes = {
  animate: PropTypes.bool.isRequired,
  align: PropTypes.oneOf(['left', 'right']).isRequired,
  children: PropTypes.node,
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  panelClassName: PropTypes.string,
  rootNode: UILayer.propTypes.rootNode,
  scrollElementRef: refObject.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  _dontMakeNewLayer: PropTypes.bool,
  panelKey: PropTypes.string
};
UIPanel.contextTypes = {
  sandboxed: PropTypes.bool
};
UIPanel.defaultProps = {
  align: 'right',
  animate: true,
  width: '30%',
  _dontMakeNewLayer: false
};
UIPanel.displayName = 'UIPanel';
export default ShareScrollElement(UIPanel);