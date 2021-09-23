'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Component, renderHtmlTemplate } from '../util/ComponentsUtil';
var OVERLAY_CLASS = 'overlay';

var Overlay = /*#__PURE__*/function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay() {
    _classCallCheck(this, Overlay);

    return _possibleConstructorReturn(this, _getPrototypeOf(Overlay).apply(this, arguments));
  }

  _createClass(Overlay, [{
    key: "render",
    value: function render() {
      var overlay = renderHtmlTemplate("\n      <div class=" + OVERLAY_CLASS + "></div>\n    ");
      return overlay;
    }
  }]);

  return Overlay;
}(Component);

export { Overlay as default };
Overlay.style = "\n  ." + OVERLAY_CLASS + " {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    top: 0; \n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: rgba(0,0,0,0.5);\n    z-index: 11111;\n  }\n";