'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { isElement } from './utils/DOMShims';
import AlertStyles from './views/AlertStyles';

var AlertStyleInjector = /*#__PURE__*/function () {
  function AlertStyleInjector() {
    _classCallCheck(this, AlertStyleInjector);

    this.hasInjected = false;
  }

  _createClass(AlertStyleInjector, [{
    key: "inject",
    value: function inject() {
      if (this.hasInjected) return;
      var headElement = document.getElementsByTagName('head')[0];

      if (isElement(headElement)) {
        var styleEl = AlertStyles.getCss();
        headElement.appendChild(styleEl);
        this.hasInjected = true; // eslint-disable-next-line consistent-return

        return true;
      }
    }
  }]);

  return AlertStyleInjector;
}();

export default new AlertStyleInjector();