'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

function mandatory(name) {
  throw new Error("Required parameter '" + name + "' was not provided");
}

var NavItem = /*#__PURE__*/function () {
  function NavItem(parentId, _ref) {
    var _ref$id = _ref.id,
        id = _ref$id === void 0 ? mandatory('id') : _ref$id,
        _ref$label = _ref.label,
        label = _ref$label === void 0 ? mandatory('label') : _ref$label,
        _ref$children = _ref.children,
        children = _ref$children === void 0 ? [] : _ref$children,
        path = _ref.path,
        _ref$isBeta = _ref.isBeta,
        isBeta = _ref$isBeta === void 0 ? false : _ref$isBeta,
        _ref$isNew = _ref.isNew,
        isNew = _ref$isNew === void 0 ? false : _ref$isNew;

    _classCallCheck(this, NavItem);

    if (!children.length && typeof path === 'undefined') {
      throw new Error('path is required when children are not provided');
    }

    if (path && !id) {
      throw new Error('trackingScreen is required for all links');
    }

    if (!Array.isArray(children)) {
      throw new Error('children must be an array');
    }

    this.id = id;
    this.label = label;
    this.settingsGroup = parentId || id;
    this.trackingScreen = id;
    this.isBeta = isBeta;
    this.isNew = isNew;
    this.path = path && path.replace(/\/$/, '');
    this.children = children.map(function (child) {
      return new NavItem(id, Object.assign({}, child));
    });
  }

  _createClass(NavItem, [{
    key: "matchesPath",
    value: function matchesPath(path) {
      if (this.children.length) {
        return this.children.some(function (child) {
          return child.matchesPath(path);
        });
      }

      var splitHref = this.path.split('/');
      var splitPath = path.split('/');
      return splitPath.length >= splitHref.length && splitHref.every(function (hrefComponent, index) {
        return hrefComponent === splitPath[index];
      });
    }
  }, {
    key: "getHrefMatchingPath",
    value: function getHrefMatchingPath(path) {
      if (this.children.length) {
        var matchingChild = this.children.find(function (child) {
          return child.matchesPath(path);
        });
        return matchingChild ? matchingChild.path : null;
      } else if (this.path && path.indexOf(this.path) === 0) {
        return this.path;
      }

      return null;
    }
  }, {
    key: "findMatchingItem",
    value: function findMatchingItem(path) {
      var match;

      if (this.children.length > 0) {
        this.children.some(function (navItem) {
          match = navItem.findMatchingItem(path);

          if (match) {
            return true;
          }

          return false;
        });
      } else if (this.matchesPath(path)) {
        match = this;
      }

      return match;
    }
  }]);

  return NavItem;
}();

export { NavItem as default };