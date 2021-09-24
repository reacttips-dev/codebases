'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { MARIGOLD, OLAF, SORBET } from 'HubStyleTokens/colors';
import I18n from 'I18n';
import PRE_PERMISSION_IMAGE from 'bender-url!notifications/img/pre-premission-image.svg';
import { Component, renderHtmlTemplate } from '../util/ComponentsUtil';
export var FADE_IN_CLASS = 'fade-in';
var BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS = 'browser-notifications-pre-permission-popup';

var PrePermissionPopup = /*#__PURE__*/function (_Component) {
  _inherits(PrePermissionPopup, _Component);

  function PrePermissionPopup(props) {
    var _this;

    _classCallCheck(this, PrePermissionPopup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PrePermissionPopup).call(this, props));
    _this.close = _this.close.bind(_assertThisInitialized(_this));
    _this.handleContinueClick = _this.handleContinueClick.bind(_assertThisInitialized(_this));
    _this.handleMaybeLaterClick = _this.handleMaybeLaterClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PrePermissionPopup, [{
    key: "close",
    value: function close() {
      this.node.parentNode.removeChild(this.node);
    }
  }, {
    key: "handleContinueClick",
    value: function handleContinueClick() {
      this.close();
      this.props.onContinueClick();
    }
  }, {
    key: "handleMaybeLaterClick",
    value: function handleMaybeLaterClick() {
      this.close();
      this.props.onMaybeLaterClick();
    }
  }, {
    key: "render",
    value: function render() {
      var popup = renderHtmlTemplate("\n      <div class=\"" + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + "\">\n        <img src=\"" + PRE_PERMISSION_IMAGE + "\" />\n        <header>\n          " + I18n.text('app.prePermission.header') + "         \n        </header>\n        <p>\n          " + I18n.text('app.prePermission.bodyTextTop') + "\n        </p>\n        <p>\n          " + I18n.text('app.prePermission.bodyTextBottom') + "\n        </p>\n        <div>\n          <button data-selenium='pre-permission-continue'>\n            " + I18n.text('app.prePermission.continueButton') + "\n          </button>\n          <a data-selenium='pre-permission-later'>\n            " + I18n.text('app.prePermission.maybeLaterLink') + "\n          </a>\n        </div>\n      </div>\n    ");
      popup.querySelector('button').addEventListener('click', this.handleContinueClick);
      popup.querySelector('a').addEventListener('click', this.handleMaybeLaterClick);
      return popup;
    }
  }]);

  return PrePermissionPopup;
}(Component);

export { PrePermissionPopup as default };
PrePermissionPopup.style = "\n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " {\n    background: linear-gradient(to top left, " + SORBET + ", " + MARIGOLD + ");\n    border-radius: 3px;\n    color: " + OLAF + ";\n    font-family: Avenir Next W02,Helvetica,Arial,sans-serif;\n    font-size: 14px;\n    left: 15px;\n    opacity: 0;\n    padding: 30px 20px;\n    position: fixed;\n    text-align: center;\n    top: 15px;\n    transition: opacity 0.5s ease;\n    width: 420px;\n    z-index: 11111;\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + "." + FADE_IN_CLASS + " {\n    opacity: 1;\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " ::after {\n    border-color: " + MARIGOLD + " transparent;\n    border-width: 0 15px 15px;\n    border-style: solid;\n    bottom: auto;\n    content: \"\";\n    display: block;\n    left: 75px;\n    position: absolute;\n    right: auto;\n    top: -15px;\n    width: 0;\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " img {\n    margin-bottom: 10px;\n    width: 120px;\n  }  \n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " header {\n    font-size: 20px;\n    font-weight: 500;\n    line-height: 23px;\n    margin-bottom: 10px;\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " header + p {\n    margin-bottom: 25px\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " p {\n    margin: 0 0 10px;\n    line-height: 20px;\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " button {\n    background-color: " + OLAF + ";\n    border: 0;\n    border-radius: 3px;\n    color: " + SORBET + ";\n    cursor: pointer;\n    font-size: 14px;\n    font-weight: 500;\n    margin: 5px 0 10px;\n    padding: 5px;\n    width: 200px\n  }\n  \n  ." + BROWSER_NOTIFICATIONS_PRE_PERMISSION_POPUP_CLASS + " a {\n    display: block;\n    color: " + OLAF + ";\n    cursor: pointer;\n    font-size: 12px;\n    text-decoration: none;\n  }\n";