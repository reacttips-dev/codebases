'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { callIfPossible } from '../core/Functions';
import { getDefaultNode } from '../utils/RootNode';
import domElementPropType from '../utils/propTypes/domElement';
import PortalLayer from './internal/PortalLayer';

var UILayer = /*#__PURE__*/function (_Component) {
  _inherits(UILayer, _Component);

  function UILayer(props) {
    var _this;

    _classCallCheck(this, UILayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UILayer).call(this, props));

    _this.handleCloseComplete = function () {
      var _this$props = _this.props,
          onCloseComplete = _this$props.onCloseComplete,
          transitionProps = _this$props.transitionProps;
      callIfPossible(transitionProps && transitionProps.onCloseComplete);
      callIfPossible(onCloseComplete);

      _this._rootNode.removeChild(_this._element);
    };

    _this.renderTree = function (content) {
      var _this$props2 = _this.props,
          Transition = _this$props2.Transition,
          transitionProps = _this$props2.transitionProps;
      if (!Transition) return content;
      return /*#__PURE__*/_jsx(Transition, Object.assign({}, transitionProps, {
        onCloseComplete: _this.handleCloseComplete,
        transitionOnMount: transitionProps && transitionProps.transitionOnMount,
        children: content
      }));
    };

    _this._rootNode = props.rootNode || getDefaultNode();
    _this._element = document.createElement('div');
    _this._element.className = 'private-layer';

    _this._element.setAttribute('data-layer-for', props['data-layer-for']);

    _this._rootNode.appendChild(_this._element);

    return _this;
  }

  _createClass(UILayer, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var Transition = this.props.Transition;
      if (!Transition) this.handleCloseComplete();
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return /*#__PURE__*/_jsx(PortalLayer, {
        element: this._element,
        renderTree: this.renderTree,
        children: children
      });
    }
  }]);

  return UILayer;
}(Component);

UILayer.propTypes = {
  children: PropTypes.node.isRequired,
  'data-layer-for': PropTypes.string,
  onCloseComplete: PropTypes.func,
  rootNode: domElementPropType,
  Transition: PropTypes.elementType,
  transitionProps: PropTypes.object
};
UILayer.displayName = 'UILayer';
export default UILayer;