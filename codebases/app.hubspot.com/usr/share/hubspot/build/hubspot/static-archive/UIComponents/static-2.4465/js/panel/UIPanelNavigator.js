'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { PANEL_SHADOW_COLOR } from 'HubStyleTokens/theme';
import { PANEL_NAVIGATOR_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { Children, cloneElement, Component } from 'react';
import invariant from 'react-utils/invariant';
import memoizeOne from 'react-utils/memoizeOne';
import styled from 'styled-components';
import * as PanelNavigatorContext from '../context/PanelNavigatorContext';
import UIDialogBackButton from '../dialog/UIDialogBackButton';
import UIModalPanel from '../dialog/UIModalPanel';
import UILayer from '../layer/UILayer';
import PanelNavigatorTransition from './internal/PanelNavigatorTransition';
import PanelTransition from './internal/PanelTransition';
import { getPanelTransitionProps } from './internal/panelUtils';
var TRANSITION_TIMING = parseInt(PANEL_NAVIGATOR_TRANSITION_TIMING, 10);

var NonModalLayer = function NonModalLayer(props) {
  return /*#__PURE__*/_jsx(UILayer, Object.assign({}, props, {
    Transition: PanelTransition
  }));
};

var ModalLayer = function ModalLayer(props) {
  var __transitionProps = props.transitionProps,
      rest = _objectWithoutProperties(props, ["transitionProps"]);

  return /*#__PURE__*/_jsx(UIModalPanel, Object.assign({
    width: "auto"
  }, rest));
};

var Layer = function Layer(props) {
  var modal = props.modal,
      sandboxed = props.sandboxed,
      children = props.children,
      rest = _objectWithoutProperties(props, ["modal", "sandboxed", "children"]);

  if (sandboxed) {
    return /*#__PURE__*/_jsx("div", {
      style: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0
      },
      children: children
    });
  }

  var LayerComponent = modal ? ModalLayer : NonModalLayer;
  return /*#__PURE__*/_jsx(LayerComponent, Object.assign({}, rest, {
    children: children
  }));
};

var PanelNavigator = styled.div.withConfig({
  displayName: "UIPanelNavigator__PanelNavigator",
  componentId: "cspyue-0"
})(["height:100%;overflow-x:hidden;overflow-y:auto;box-shadow:", "px 0 8px 0 ", ";"], function (_ref) {
  var align = _ref.align;
  return align === 'left' ? 3 : -3;
}, PANEL_SHADOW_COLOR);

var UIPanelNavigator = /*#__PURE__*/function (_Component) {
  _inherits(UIPanelNavigator, _Component);

  function UIPanelNavigator(props) {
    var _this;

    _classCallCheck(this, UIPanelNavigator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIPanelNavigator).call(this, props));

    _this.getCurrentPanel = function () {
      var _this$props = _this.props,
          currentPanel = _this$props.currentPanel,
          children = _this$props.children,
          align = _this$props.align;
      var panel = Children.toArray(children).find(function (child) {
        return child.props.panelKey === currentPanel;
      });

      if (panel) {
        var className = panel.props.className;
        var classes = classNames('private-panel-navigator--child', className);
        return /*#__PURE__*/cloneElement(panel, {
          _dontMakeNewLayer: true,
          key: panel.props.panelKey,
          align: align,
          className: classes
        });
      }

      return panel;
    };

    _this.renderPreviousButton = function (panelKey) {
      var _this$props2 = _this.props,
          children = _this$props2.children,
          onPreviousClick = _this$props2.onPreviousClick,
          panelOrder = _this$props2.panelOrder;
      var isRootPanel = panelOrder ? panelOrder.indexOf(panelKey) === 0 : children[0].props.panelKey === panelKey;
      if (isRootPanel) return null;
      return /*#__PURE__*/_jsx(UIDialogBackButton, {
        onClick: onPreviousClick
      });
    };

    _this.state = {
      animateForward: true
    };
    _this._panelNavigatorCtxValue = {
      getCurrentPanel: function getCurrentPanel() {
        return _this.props.currentPanel;
      },
      renderNavigation: _this.renderPreviousButton
    };
    _this._getTransitionProps = memoizeOne(getPanelTransitionProps);
    return _this;
  }

  _createClass(UIPanelNavigator, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var children = nextProps.children,
          nextPanel = nextProps.currentPanel,
          panelOrder = nextProps.panelOrder;
      var currentPanel = this.props.currentPanel;

      if (nextPanel !== currentPanel) {
        var nextPanelIndex = -1;
        var currentPanelIndex = -1;

        if (panelOrder) {
          nextPanelIndex = panelOrder.indexOf(nextPanel);
          currentPanelIndex = panelOrder.indexOf(currentPanel);
        }

        if (nextPanelIndex === -1 || currentPanelIndex === -1) {
          Children.forEach(children, function (child, i) {
            if (child.props.panelKey === nextPanel) nextPanelIndex = i;
            if (child.props.panelKey === currentPanel) currentPanelIndex = i;
          });
        }

        var shouldAnimateForward = nextPanelIndex > currentPanelIndex;

        if (shouldAnimateForward !== this.state.animateForward) {
          this.setState({
            animateForward: shouldAnimateForward
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          align = _this$props3.align,
          animate = _this$props3.animate,
          children = _this$props3.children,
          className = _this$props3.className,
          __currentPanel = _this$props3.currentPanel,
          modal = _this$props3.modal,
          onOpenStart = _this$props3.onOpenStart,
          onOpenComplete = _this$props3.onOpenComplete,
          onCloseStart = _this$props3.onCloseStart,
          onCloseComplete = _this$props3.onCloseComplete,
          __onPreviousClick = _this$props3.onPreviousClick,
          __panelOrder = _this$props3.panelOrder,
          style = _this$props3.style,
          rest = _objectWithoutProperties(_this$props3, ["align", "animate", "children", "className", "currentPanel", "modal", "onOpenStart", "onOpenComplete", "onCloseStart", "onCloseComplete", "onPreviousClick", "panelOrder", "style"]);

      var animateForward = this.state.animateForward;
      var sandboxed = this.context.sandboxed;
      var currentPanel = this.getCurrentPanel();

      if (process.env.NODE_ENV !== 'production') {
        Children.forEach(children, function (child) {
          invariant(typeof child.props._dontMakeNewLayer === 'boolean', 'UIPanelNavigator: Children should normally be `UIPanel` instances. To silence this ' + 'error, define a boolean value for `_dontMakeNewLayer` on each child.');
          invariant(typeof child.props.panelKey === 'string', 'UIPanelNavigator: Each child must have a `panelKey`.');
          invariant(child.props.width != null, 'UIPanelNavigator: Each child must have a `width`.');
        });
      }

      return /*#__PURE__*/_jsx(PanelNavigatorContext.Provider, {
        value: this._panelNavigatorCtxValue,
        children: /*#__PURE__*/_jsx(Layer, Object.assign({
          "data-layer-for": "UIPanelNavigator",
          modal: modal,
          sandboxed: sandboxed,
          transitionProps: this._getTransitionProps(onOpenStart, onOpenComplete, onCloseStart, onCloseComplete, align, animate)
        }, rest, {
          children: /*#__PURE__*/_jsx(PanelNavigator, {
            align: align,
            className: className,
            style: style,
            children: /*#__PURE__*/_jsx(PanelNavigatorTransition, {
              duration: TRANSITION_TIMING,
              reverse: !animateForward,
              children: currentPanel
            })
          })
        }))
      });
    }
  }]);

  return UIPanelNavigator;
}(Component);

UIPanelNavigator.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  animate: PropTypes.bool.isRequired,
  children: PropTypes.node,
  currentPanel: PropTypes.string.isRequired,
  modal: PropTypes.bool.isRequired,
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  panelOrder: PropTypes.arrayOf(PropTypes.string),
  onPreviousClick: PropTypes.func,
  rootNode: UILayer.propTypes.rootNode
};
UIPanelNavigator.contextTypes = {
  sandboxed: PropTypes.bool
};
UIPanelNavigator.defaultProps = {
  align: 'right',
  animate: true,
  modal: false
};
UIPanelNavigator.displayName = 'UIPanelNavigator';
export default UIPanelNavigator;