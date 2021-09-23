'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { createPortal, render } from 'react-dom';
import domElementPropType from '../../utils/propTypes/domElement';

var PortalLayer = /*#__PURE__*/function (_Component) {
  _inherits(PortalLayer, _Component);

  function PortalLayer() {
    _classCallCheck(this, PortalLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PortalLayer).apply(this, arguments));
  }

  _createClass(PortalLayer, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props = this.props,
          element = _this$props.element,
          renderTree = _this$props.renderTree;
      var closeTransitionTree = renderTree(null);
      if (!closeTransitionTree) return;
      var originalTransitionContents = Array.prototype.map.call(element.firstChild.children, function (childElement) {
        return childElement.cloneNode(true);
      });
      var closeTransitionContainer = document.createElement('div');
      element.appendChild(closeTransitionContainer);
      render(closeTransitionTree, closeTransitionContainer, function () {
        originalTransitionContents.forEach(function (el) {
          return closeTransitionContainer.firstChild.appendChild(el);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          element = _this$props2.element,
          renderTree = _this$props2.renderTree;
      var tree = renderTree(children);
      return /*#__PURE__*/createPortal(tree, element);
    }
  }]);

  return PortalLayer;
}(Component);

PortalLayer.propTypes = {
  children: PropTypes.node.isRequired,
  element: domElementPropType.isRequired,
  renderTree: PropTypes.func.isRequired
};
export default PortalLayer;