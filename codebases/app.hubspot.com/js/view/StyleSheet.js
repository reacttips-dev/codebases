'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { CALYPSO_DARK, CALYPSO_LIGHT, CALYPSO_MEDIUM, EERIE, HEFFALUMP, LINK_HOVER } from 'HubStyleTokens/colors';
import { FALLBACK_FONT_STACK, WEB_FONT_REGULAR } from 'HubStyleTokens/misc';
import { FADEIN_FLOATING_ALERT_TIMEOUT, FADEOUT_FLOATING_ALERT_DURATION, FLOATING_ALERT_BUTTON_SR_TEXT_CLASS, FLOATING_ALERT_CLOSE_BUTTON_CLASS, FLOATING_ALERT_CONTAINER_CLASS, FLOATING_ALERT_CONTAINER_SHOW_CLASS, NEW_COUNTER_NODE_CLASS, OLD_COUNTER_NODE_CLASS, OLD_ICON_UNREAD_CLASS, OLD_NAV_NOTIFICATIONS_ICON_CONTAINER } from '../constants/ViewConstants';
var FONT_FAMILY = WEB_FONT_REGULAR + ", " + FALLBACK_FONT_STACK;

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet() {
    _classCallCheck(this, StyleSheet);

    this.styles = "\n      ." + FLOATING_ALERT_CONTAINER_CLASS + " {\n        background-color: " + CALYPSO_LIGHT + ";\n        border: 1px solid " + CALYPSO_MEDIUM + ";\n        box-sizing: border-box;\n        color: " + HEFFALUMP + ";\n        cursor: default;\n        font-family: " + FONT_FAMILY + ";\n        font-size: 14px;\n        font-weight: 500;\n        left: 50%;\n        line-height: 24px;\n        max-width: 900px;\n        min-width: 500px;\n        opacity: 0;\n        padding: 17px 60px 17px 20px;\n        position: fixed;\n        top: 62px;\n        transform: translateX(-50%);\n        transition: opacity " + FADEOUT_FLOATING_ALERT_DURATION + "ms;\n        z-index: 1300;\n      }\n\n      ." + FLOATING_ALERT_CONTAINER_SHOW_CLASS + " {\n        cursor: pointer;\n        opacity: 1;\n        transition: opacity " + FADEIN_FLOATING_ALERT_TIMEOUT + "ms;\n      }\n\n      ." + FLOATING_ALERT_CONTAINER_CLASS + " a {\n        color: " + CALYPSO_DARK + ";\n        text-decoration: none;\n      }\n\n      ." + FLOATING_ALERT_CONTAINER_CLASS + " a:hover {\n        color: " + LINK_HOVER + ";\n        text-decoration: underline;\n      }\n\n      ." + FLOATING_ALERT_CLOSE_BUTTON_CLASS + " {\n        background: scroll border-box transparent none 0% 0% repeat;\n        border: 0px none;\n        box-sizing: border-box;\n        color: " + EERIE + ";\n        cursor: pointer;\n        display: block;\n        font-kerning: auto;\n        height: 16px;\n        line-height: 24px;\n        margin: 0;\n        outline-offset: 0px;\n        overflow: visible;\n        padding: 0px;\n        position: absolute;\n        right: 24px;\n        text-align: start;\n        text-transform: none;\n        top: 22px;\n        transition: all 0.15s ease-out 0s;\n        width: 16px;\n      }\n\n      ." + FLOATING_ALERT_CLOSE_BUTTON_CLASS + ":after {\n        display: block;\n        background: rgba(255, 255, 255, 0);\n        border-radius: 100%;\n        padding: 20px;\n        content: ' ';\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translateZ(0) translate(-50%, -50%);\n        transition: all 150ms ease-out;\n      }\n\n      ." + FLOATING_ALERT_CLOSE_BUTTON_CLASS + ":hover:after {\n        background: rgba(255, 255, 255, 0.1);\n      }\n\n      ." + FLOATING_ALERT_CLOSE_BUTTON_CLASS + " path {\n        fill: currentColor;\n        stroke: currentColor;\n        stroke-width: 2;\n      }\n\n      ." + FLOATING_ALERT_BUTTON_SR_TEXT_CLASS + " {\n        border: 0 !important;\n        clip: rect(0, 0, 0, 0) !important;\n        height: 1px !important;\n        margin: -1px !important;\n        overflow: hidden !important;\n        padding: 0 !important;\n        position: absolute !important;\n        width: 1px !important;\n      }\n\n      ." + NEW_COUNTER_NODE_CLASS + " {\n        background-color: #F3547D !important;\n        border: 1px solid white !important;\n        border-radius: 500px !important;\n        box-shadow: 0 0 0 1px #FFF !important;\n        color: #FFF !important;\n        display: inline-block !important;\n        font-size: .6875rem !important;\n        font-weight: 600 !important;\n        line-height: 1.1875rem !important;\n        min-height: 1.3125rem !important;\n        min-width: 1.3125rem !important;\n        padding: 0 .25rem !important;\n        position: absolute !important;\n        right: 3px !important;\n        text-align: center !important;\n        top: 2px !important;\n        vertical-align: baseline !important;\n        transform: scale(0.8) !important;\n        -webkit-transform: scale(0.8) !important;\n        -moz-transform: scale(0.8) !important;\n      }\n\n      ." + OLD_COUNTER_NODE_CLASS + " {\n        background-color: #F04b51 !important;\n        border-radius: 5px !important;\n        display: inline-block !important;\n        position: absolute !important;\n        color: #ffffff !important;\n        padding: 0 2px 3px 0 !important;\n        font-size: 11px !important;\n        top: 8px !important;\n        right: -1px;\n        line-height: 15px;\n        height: 15px;\n        min-width: 14px;\n        font-weight: bold;\n        text-align: center;\n      }\n\n      ." + OLD_NAV_NOTIFICATIONS_ICON_CONTAINER + "." + OLD_ICON_UNREAD_CLASS + " {\n        opacity: 0.95 !important;\n      }\n    ";
  }
  /**
   * Get a <style> tag with the CSS for the app.
   *
   * We do this to minimize the number of requests that need to be made to create a floating
   * notification. Loading via SASS would necessitate a separate request.
   *
   * Styles are taken from the UIAlert component
   *
   * @see https://tools.hubteam.com/ui-library/family/UIComponents/families/AlertsMessaging
   * @returns {Element}
   */


  _createClass(StyleSheet, [{
    key: "getStyleElement",
    value: function getStyleElement() {
      var styleElement = document.createElement('style');
      styleElement.innerHTML = this.styles;
      return styleElement;
    }
  }]);

  return StyleSheet;
}();

export default new StyleSheet();