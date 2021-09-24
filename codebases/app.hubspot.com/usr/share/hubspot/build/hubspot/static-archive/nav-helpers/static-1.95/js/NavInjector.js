'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { HUBSPOT_NAV_V3_ID, HUBSPOT_NAV_V4_ID, HUBSPOT_NAV_NO_BOTTOM_MARGIN_CLASS, HUBSPOT_NAV_BEFORE_ID, HUBSPOT_NAV_AFTER_ID } from './constants/DOMSelectors';
import { insertAfter, isElement, getOrCreateElement, replaceChildren } from './utils/DOMShims';

var NavInjector = /*#__PURE__*/function () {
  function NavInjector() {
    _classCallCheck(this, NavInjector);

    this.siblings = [];
    this.nav = null;
  }

  _createClass(NavInjector, [{
    key: "insertBefore",
    value: function insertBefore(sibling) {
      this._insert(sibling, 'before');
    }
  }, {
    key: "insertAfter",
    value: function insertAfter(sibling) {
      this._insert(sibling, 'after');
    }
  }, {
    key: "_insert",
    value: function _insert(sibling, position) {
      if (!isElement(sibling.element)) return;
      this.siblings.push(Object.assign({}, sibling, {
        position: position
      }));
      this.render();
    }
  }, {
    key: "_getNav",
    value: function _getNav() {
      if (isElement(this.nav)) {
        return this.nav;
      }

      var nav = document.getElementById(HUBSPOT_NAV_V4_ID) || document.getElementById(HUBSPOT_NAV_V3_ID);

      if (isElement(nav)) {
        this.nav = nav;
      }

      return nav;
    }
  }, {
    key: "_getSiblingsToRender",
    value: function _getSiblingsToRender() {
      if (this.siblings.length === 1) {
        return this.siblings;
      }

      return this.siblings.reduce(function (accumulator, sibling) {
        if (sibling.isPriority || accumulator.length === 0) {
          accumulator.push(sibling);

          if (accumulator.length > 1) {
            accumulator = accumulator.reduce(function (accumulatorInner, siblingInner) {
              if (siblingInner.isPriority) {
                accumulatorInner.push(siblingInner);
              }

              return accumulatorInner;
            }, []);
          }
        }

        return accumulator;
      }, []);
    }
  }, {
    key: "_getSiblingContainer",
    value: function _getSiblingContainer(hsNav, elements, id) {
      var container = getOrCreateElement(id);
      container = replaceChildren(container, elements);

      if (hsNav.className.indexOf(HUBSPOT_NAV_NO_BOTTOM_MARGIN_CLASS) !== -1) {
        container.className += " " + HUBSPOT_NAV_NO_BOTTOM_MARGIN_CLASS;
      }

      return container;
    }
  }, {
    key: "remove",
    value: function remove(key) {
      this.siblings = this.siblings.reduce(function (accumulator, sibling) {
        if (sibling.key !== key) {
          accumulator.push(sibling);
        }

        return accumulator;
      }, []);
      this.render();
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      this.siblings = [];
      this.render();
    }
  }, {
    key: "_renderBefore",
    value: function _renderBefore() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var hsNav = this._getNav();

      if (!isElement(hsNav)) return;

      var container = this._getSiblingContainer(hsNav, elements, HUBSPOT_NAV_BEFORE_ID);

      hsNav.parentNode.insertBefore(container, hsNav);
    }
  }, {
    key: "_renderAfter",
    value: function _renderAfter() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var hsNav = this._getNav();

      if (!isElement(hsNav)) return;

      var container = this._getSiblingContainer(hsNav, elements, HUBSPOT_NAV_AFTER_ID);

      insertAfter(container, hsNav);
    }
  }, {
    key: "render",
    value: function render() {
      var siblingsToRender = this._getSiblingsToRender();

      var elementsToRenderBeforeNav = [];
      var elementsToRenderAfterNav = [];
      siblingsToRender.forEach(function (sibling) {
        if (sibling.position === 'before') {
          elementsToRenderBeforeNav.push(sibling.element);
        } else if (sibling.position === 'after') {
          elementsToRenderAfterNav.push(sibling.element);
        }
      });

      this._renderBefore(elementsToRenderBeforeNav);

      this._renderAfter(elementsToRenderAfterNav);
    }
  }]);

  return NavInjector;
}();

export default new NavInjector();