'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILayer from 'UIComponents/layer/UILayer';
import { StyleSheetManager } from 'styled-components';
/**
 * Create a UILayer (UIComponents' version of a portal) that also carries
 * component styling with it.
 * @param {{rootNode: Element, head: HTMLHeadElement}} props
 */

var Layer = function Layer(_ref) {
  var _ref$rootNode = _ref.rootNode,
      rootNode = _ref$rootNode === void 0 ? document.body : _ref$rootNode,
      _ref$head = _ref.head,
      head = _ref$head === void 0 ? rootNode.getRootNode().head : _ref$head,
      dataLayerName = _ref.name,
      children = _ref.children;
  return rootNode && head && /*#__PURE__*/_jsx(UILayer, {
    rootNode: rootNode,
    "data-layer-for": dataLayerName,
    children: /*#__PURE__*/_jsx(StyleSheetManager, {
      target: head,
      children: children
    })
  });
};

export default Layer;