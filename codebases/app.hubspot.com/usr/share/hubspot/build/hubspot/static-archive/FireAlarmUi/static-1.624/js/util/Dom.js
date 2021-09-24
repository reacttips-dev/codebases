'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var Dom = /*#__PURE__*/function () {
  function Dom(doc) {
    _classCallCheck(this, Dom);

    this.document = doc || window.document;
  }
  /**
   * Create a DOM element
   *
   * @param string        type        Type of DOM node to create
   * @param array         attributes  Optional. Map of attributes to add.
   * @param array||string children    Array of DomNodes to apppend to the new element or a string text to add
   * @return DomNode
   */


  _createClass(Dom, [{
    key: "createElement",
    value: function createElement(type, attributes, children) {
      var element = this.document.createElement(type);

      if (attributes) {
        this.setAttributes(element, attributes);
      }

      if (children) {
        // Add text or child elements
        if (typeof children === 'string') {
          var text = this.document.createTextNode(children);
          element.appendChild(text);
        } else {
          children.forEach(function (child) {
            element.appendChild(child);
          });
        }
      }

      return element;
    }
    /**
     * Create an element from a HTML string
     *
     * @param string html
     * @return DomNode
     */

  }, {
    key: "createElementFromHtml",
    value: function createElementFromHtml(html) {
      var element = this.document.createElement("template");
      element.insertAdjacentHTML('afterbegin', html);
      var firstChild = element.firstChild;

      while (firstChild != null && firstChild.nodeType == 3) {
        firstChild = firstChild.nextSibling;
      }

      return firstChild;
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this.document.body;
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      return this.document.getElementById(id);
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(element, attributes) {
      for (var attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
      }

      return element;
    }
  }]);

  return Dom;
}();

export default Dom;