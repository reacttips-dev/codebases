'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
export function renderHtmlTemplate(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.children[0];
}
export function render(Component, props, children) {
  return new Component(Object.assign({}, props, {
    children: children
  })).getHtml();
}
export var Component = /*#__PURE__*/function () {
  function Component() {
    var _this = this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.rendered = new Promise(function (resolve) {
      _this.resolve = resolve;
    });
  }

  _createClass(Component, [{
    key: "attachStyle",
    value: function attachStyle() {
      if (this.constructor.styleElement) {
        return;
      }

      var styleElement = document.createElement('style');
      styleElement.innerHTML = this.constructor.style;
      this.constructor.styleElement = styleElement;
      window.top.document.head.appendChild(styleElement);
    }
  }, {
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "getHtml",
    value: function getHtml() {
      if (!this.node) {
        this.attachStyle();
        this.UNSAFE_componentWillMount();
        this.node = this.render();
        this.resolve();
      }

      return this.node;
    }
  }]);

  return Component;
}();