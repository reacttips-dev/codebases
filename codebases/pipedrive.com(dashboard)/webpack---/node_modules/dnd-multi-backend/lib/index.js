"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "HTML5DragTransition", {
  enumerable: true,
  get: function get() {
    return _Transitions.HTML5DragTransition;
  }
});
Object.defineProperty(exports, "TouchTransition", {
  enumerable: true,
  get: function get() {
    return _Transitions.TouchTransition;
  }
});
Object.defineProperty(exports, "MouseTransition", {
  enumerable: true,
  get: function get() {
    return _Transitions.MouseTransition;
  }
});
Object.defineProperty(exports, "createTransition", {
  enumerable: true,
  get: function get() {
    return _createTransition.default;
  }
});
Object.defineProperty(exports, "MultiBackend", {
  enumerable: true,
  get: function get() {
    return _MultiBackend.default;
  }
});
Object.defineProperty(exports, "PreviewManager", {
  enumerable: true,
  get: function get() {
    return _MultiBackend.PreviewManager;
  }
});
exports.default = void 0;

var _Transitions = require("./Transitions");

var _createTransition = _interopRequireDefault(require("./createTransition"));

var _MultiBackend = _interopRequireWildcard(require("./MultiBackend"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(managerOrOptions) {
  if (managerOrOptions.getMonitor) {
    return new _MultiBackend.default(managerOrOptions);
  }

  return function (manager) {
    return new _MultiBackend.default(manager, managerOrOptions);
  };
};

exports.default = _default;