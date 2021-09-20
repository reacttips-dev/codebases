'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _justReduceObject = require('just-reduce-object');

var _justReduceObject2 = _interopRequireDefault(_justReduceObject);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _events = require('events');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var warning = function warning(text) {
  if (process && process.env.NODE_ENV !== 'production') {
    console.warn(text);
  }
};

var ShortcutManager = function (_EventEmitter) {
  _inherits(ShortcutManager, _EventEmitter);

  function ShortcutManager() {
    var keymap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ShortcutManager);

    var _this = _possibleConstructorReturn(this, (ShortcutManager.__proto__ || Object.getPrototypeOf(ShortcutManager)).call(this));

    _this._platformName = _helpers2.default.getPlatformName();

    _this._parseShortcutDescriptor = function (item) {
      if ((0, _utils.isPlainObject)(item)) {
        return item[_this._platformName];
      }
      return item;
    };

    _this._keymap = keymap;
    return _this;
  }

  _createClass(ShortcutManager, [{
    key: 'addUpdateListener',
    value: function addUpdateListener(callback) {
      (0, _invariant2.default)(callback, 'addUpdateListener: callback argument is not defined or falsy');
      this.on(ShortcutManager.CHANGE_EVENT, callback);
    }
  }, {
    key: 'removeUpdateListener',
    value: function removeUpdateListener(callback) {
      this.removeListener(ShortcutManager.CHANGE_EVENT, callback);
    }
  }, {
    key: 'setKeymap',
    value: function setKeymap(keymap) {
      (0, _invariant2.default)(keymap, 'setKeymap: keymap argument is not defined or falsy.');
      this._keymap = keymap;
      this.emit(ShortcutManager.CHANGE_EVENT);
    }
  }, {
    key: 'extendKeymap',
    value: function extendKeymap(keymap) {
      (0, _invariant2.default)(keymap, 'extendKeymap: keymap argument is not defined or falsy.');
      this._keymap = Object.assign({}, this._keymap, keymap);
      this.emit(ShortcutManager.CHANGE_EVENT);
    }
  }, {
    key: 'getAllShortcuts',
    value: function getAllShortcuts() {
      return this._keymap;
    }
  }, {
    key: 'getAllShortcutsForPlatform',
    value: function getAllShortcutsForPlatform(platformName) {
      var _transformShortcuts = function _transformShortcuts(shortcuts) {
        return (0, _justReduceObject2.default)(shortcuts, function (result, keyName, keyValue) {
          if ((0, _utils.isPlainObject)(keyValue)) {
            if (keyValue[platformName]) {
              keyValue = keyValue[platformName];
            } else {
              result[keyName] = _transformShortcuts(keyValue);
              return result;
            }
          }

          result[keyName] = keyValue;
          return result;
        }, {});
      };

      return _transformShortcuts(this._keymap);
    }
  }, {
    key: 'getAllShortcutsForCurrentPlatform',
    value: function getAllShortcutsForCurrentPlatform() {
      return this.getAllShortcutsForPlatform(this._platformName);
    }
  }, {
    key: 'getShortcuts',
    value: function getShortcuts(componentName) {
      (0, _invariant2.default)(componentName, 'getShortcuts: name argument is not defined or falsy.');

      var cursor = this._keymap[componentName];
      if (!cursor) {
        warning('getShortcuts: There are no shortcuts with name ' + componentName + '.');
        return;
      }

      var shortcuts = (0, _utils.compact)((0, _utils.flatten)((0, _utils.map)(cursor, this._parseShortcutDescriptor)));

      return shortcuts;
    }
  }, {
    key: '_parseShortcutKeyName',
    value: function _parseShortcutKeyName(obj, keyName) {
      var _this2 = this;

      var result = (0, _utils.findKey)(obj, function (item) {
        if ((0, _utils.isPlainObject)(item)) {
          item = item[_this2._platformName];
        }
        if ((0, _utils.isArray)(item)) {
          var index = item.indexOf(keyName);
          if (index >= 0) {
            item = item[index];
          }
        }
        return item === keyName;
      });

      return result;
    }
  }, {
    key: 'findShortcutName',
    value: function findShortcutName(keyName, componentName) {
      (0, _invariant2.default)(keyName, 'findShortcutName: keyName argument is not defined or falsy.');
      (0, _invariant2.default)(componentName, 'findShortcutName: componentName argument is not defined or falsy.');

      var cursor = this._keymap[componentName];
      var result = this._parseShortcutKeyName(cursor, keyName);

      return result;
    }
  }]);

  return ShortcutManager;
}(_events.EventEmitter);

ShortcutManager.CHANGE_EVENT = 'shortcuts:update';
exports.default = ShortcutManager;
module.exports = exports['default'];