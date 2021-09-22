"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PreviewManager = void 0;

var _objectAssign = _interopRequireDefault(require("./objectAssign"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PreviewList = function PreviewList() {
  var _this = this;

  _classCallCheck(this, PreviewList);

  this.register = function (preview) {
    _this.previews.push(preview);
  };

  this.unregister = function (preview) {
    var index;

    while ((index = _this.previews.indexOf(preview)) !== -1) {
      _this.previews.splice(index, 1);
    }
  };

  this.backendChanged = function (backend) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _this.previews[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var preview = _step.value;
        preview.backendChanged(backend);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  this.previews = [];
};

var PreviewManager = new PreviewList();
exports.PreviewManager = PreviewManager;

var _default = function _default(manager, sourceOptions) {
  var _this2 = this;

  _classCallCheck(this, _default);

  this.setup = function () {
    if (typeof window === 'undefined') {
      return;
    }

    if (_this2.constructor.isSetUp) {
      throw new Error('Cannot have two MultiBackends at the same time.');
    }

    _this2.constructor.isSetUp = true;

    _this2.addEventListeners(window);

    _this2.backends[_this2.current].instance.setup();
  };

  this.teardown = function () {
    if (typeof window === 'undefined') {
      return;
    }

    _this2.constructor.isSetUp = false;

    _this2.removeEventListeners(window);

    _this2.backends[_this2.current].instance.teardown();
  };

  this.connectDragSource = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _this2.connectBackend('connectDragSource', args);
  };

  this.connectDragPreview = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _this2.connectBackend('connectDragPreview', args);
  };

  this.connectDropTarget = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _this2.connectBackend('connectDropTarget', args);
  };

  this.previewEnabled = function () {
    return _this2.backends[_this2.current].preview;
  };

  this.addEventListeners = function (target) {
    _this2.backends.forEach(function (backend) {
      if (backend.transition) {
        target.addEventListener(backend.transition.event, _this2.backendSwitcher, true);
      }
    });
  };

  this.removeEventListeners = function (target) {
    _this2.backends.forEach(function (backend) {
      if (backend.transition) {
        target.removeEventListener(backend.transition.event, _this2.backendSwitcher, true);
      }
    });
  };

  this.backendSwitcher = function (event) {
    var oldBackend = _this2.current;
    var i = 0;

    _this2.backends.some(function (backend) {
      if (i !== _this2.current && backend.transition && backend.transition.check(event)) {
        _this2.current = i;
        return true;
      }

      i += 1;
      return false;
    });

    if (_this2.current !== oldBackend) {
      _this2.backends[oldBackend].instance.teardown();

      Object.keys(_this2.nodes).forEach(function (id) {
        var node = _this2.nodes[id];
        node.handler();
        node.handler = _this2.callBackend(node.func, node.args);
      });
      PreviewManager.backendChanged(_this2);
      var newBackend = _this2.backends[_this2.current];
      newBackend.instance.setup();

      if (newBackend.skipDispatchOnTransition) {
        return;
      }

      var newEvent = null;

      try {
        newEvent = new event.constructor(event.type, event);
      } catch (_e) {
        newEvent = document.createEvent('Event');
        newEvent.initEvent(event.type, event.bubbles, event.cancelable);
      }

      event.target.dispatchEvent(newEvent);
    }
  };

  this.callBackend = function (func, args) {
    var _this2$backends$_this;

    return (_this2$backends$_this = _this2.backends[_this2.current].instance)[func].apply(_this2$backends$_this, _toConsumableArray(args));
  };

  this.connectBackend = function (func, args) {
    var nodeId = "".concat(func, "_").concat(args[0]);

    var handler = _this2.callBackend(func, args);

    _this2.nodes[nodeId] = {
      func: func,
      args: args,
      handler: handler
    };
    return function () {
      var _this2$nodes$nodeId;

      var r = (_this2$nodes$nodeId = _this2.nodes[nodeId]).handler.apply(_this2$nodes$nodeId, arguments);

      delete _this2.nodes[nodeId];
      return r;
    };
  };

  var options = (0, _objectAssign.default)({
    backends: []
  }, sourceOptions || {});

  if (options.backends.length < 1) {
    throw new Error("You must specify at least one Backend, if you are coming from 2.x.x (or don't understand this error)\n        see this guide: https://github.com/louisbrunner/dnd-multi-backend/tree/master/packages/react-dnd-multi-backend#migrating-from-2xx");
  }

  this.current = 0;
  this.backends = [];
  options.backends.forEach(function (backend) {
    if (!backend.backend) {
      throw new Error("You must specify a 'backend' property in your Backend entry: ".concat(backend));
    }

    var transition = backend.transition;

    if (transition && !transition._isMBTransition) {
      throw new Error("You must specify a valid 'transition' property (either undefined or the return of 'createTransition') in your Backend entry: ".concat(backend));
    }

    _this2.backends.push({
      instance: new backend.backend(manager),
      preview: backend.preview || false,
      transition: transition,
      skipDispatchOnTransition: Boolean(backend.skipDispatchOnTransition)
    });
  });
  this.nodes = {};
} // DnD Backend API
;

exports.default = _default;