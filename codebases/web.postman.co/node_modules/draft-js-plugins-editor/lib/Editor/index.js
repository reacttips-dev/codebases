'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _draftJs = require('draft-js');

var _immutable = require('immutable');

var _proxies = require('./proxies');

var _proxies2 = _interopRequireDefault(_proxies);

var _moveSelectionToEnd = require('./moveSelectionToEnd');

var _moveSelectionToEnd2 = _interopRequireDefault(_moveSelectionToEnd);

var _resolveDecorators = require('./resolveDecorators');

var _resolveDecorators2 = _interopRequireDefault(_resolveDecorators);

var _defaultKeyBindingPlugin = require('./defaultKeyBindingPlugin');

var defaultKeyBindingPlugin = _interopRequireWildcard(_defaultKeyBindingPlugin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-continue,no-restricted-syntax */


/**
 * The main editor component
 */
var PluginEditor = function (_Component) {
  _inherits(PluginEditor, _Component);

  function PluginEditor(props) {
    _classCallCheck(this, PluginEditor);

    var _this = _possibleConstructorReturn(this, (PluginEditor.__proto__ || Object.getPrototypeOf(PluginEditor)).call(this, props));

    _initialiseProps.call(_this);

    var plugins = [_this.props].concat(_toConsumableArray(_this.resolvePlugins()));
    plugins.forEach(function (plugin) {
      if (typeof plugin.initialize !== 'function') return;
      plugin.initialize(_this.getPluginMethods());
    });

    // attach proxy methods like `focus` or `blur`
    _proxies2.default.forEach(function (method) {
      _this[method] = function () {
        var _this$editor;

        return (_this$editor = _this.editor)[method].apply(_this$editor, arguments);
      };
    });

    _this.state = {}; // TODO for Nik: ask ben why this is relevent
    return _this;
  }

  _createClass(PluginEditor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var decorator = (0, _resolveDecorators2.default)(this.props, this.getEditorState, this.onChange);

      var editorState = _draftJs.EditorState.set(this.props.editorState, { decorator: decorator });
      this.onChange((0, _moveSelectionToEnd2.default)(editorState));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      var curr = this.props;
      var currDec = curr.editorState.getDecorator();
      var nextDec = next.editorState.getDecorator();

      if (currDec === nextDec) return;
      if (currDec && nextDec && currDec.decorators.size === nextDec.decorators.size) return;
      if (!currDec && nextDec) return;

      var decorator = curr.editorState.getDecorator();
      var editorState = _draftJs.EditorState.set(next.editorState, { decorator: decorator });
      this.onChange(editorState);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this2 = this;

      this.resolvePlugins().forEach(function (plugin) {
        if (plugin.willUnmount) {
          plugin.willUnmount({
            getEditorState: _this2.getEditorState,
            setEditorState: _this2.onChange
          });
        }
      });
    }

    // Cycle through the plugins, changing the editor state with what the plugins
    // changed (or didn't)


    // TODO further down in render we use readOnly={this.props.readOnly || this.state.readOnly}. Ask Ben why readOnly is here just from the props? Why would plugins use this instead of just taking it from getProps?

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var pluginHooks = this.createPluginHooks();
      var customStyleMap = this.resolveCustomStyleMap();
      var accessibilityProps = this.resolveAccessibilityProps();
      var blockRenderMap = this.resolveblockRenderMap();
      return _react2.default.createElement(_draftJs.Editor, _extends({}, this.props, accessibilityProps, pluginHooks, {
        readOnly: this.props.readOnly || this.state.readOnly,
        customStyleMap: customStyleMap,
        blockRenderMap: blockRenderMap,
        onChange: this.onChange,
        editorState: this.props.editorState,
        ref: function ref(element) {
          _this3.editor = element;
        }
      }));
    }
  }]);

  return PluginEditor;
}(_react.Component);

PluginEditor.propTypes = {
  editorState: _propTypes2.default.object.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  plugins: _propTypes2.default.array,
  defaultKeyBindings: _propTypes2.default.bool,
  defaultBlockRenderMap: _propTypes2.default.bool,
  customStyleMap: _propTypes2.default.object,
  // eslint-disable-next-line react/no-unused-prop-types
  decorators: _propTypes2.default.array
};
PluginEditor.defaultProps = {
  defaultBlockRenderMap: true,
  defaultKeyBindings: true,
  customStyleMap: {},
  plugins: [],
  decorators: []
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.onChange = function (editorState) {
    var newEditorState = editorState;
    _this4.resolvePlugins().forEach(function (plugin) {
      if (plugin.onChange) {
        newEditorState = plugin.onChange(newEditorState, _this4.getPluginMethods());
      }
    });

    if (_this4.props.onChange) {
      _this4.props.onChange(newEditorState, _this4.getPluginMethods());
    }
  };

  this.getPlugins = function () {
    return _this4.props.plugins.slice(0);
  };

  this.getProps = function () {
    return _extends({}, _this4.props);
  };

  this.getReadOnly = function () {
    return _this4.props.readOnly;
  };

  this.setReadOnly = function (readOnly) {
    if (readOnly !== _this4.state.readOnly) _this4.setState({ readOnly: readOnly });
  };

  this.getEditorRef = function () {
    return _this4.editor;
  };

  this.getEditorState = function () {
    return _this4.props.editorState;
  };

  this.getPluginMethods = function () {
    return {
      getPlugins: _this4.getPlugins,
      getProps: _this4.getProps,
      setEditorState: _this4.onChange,
      getEditorState: _this4.getEditorState,
      getReadOnly: _this4.getReadOnly,
      setReadOnly: _this4.setReadOnly,
      getEditorRef: _this4.getEditorRef
    };
  };

  this.createEventHooks = function (methodName, plugins) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var newArgs = [].slice.apply(args);
      newArgs.push(_this4.getPluginMethods());

      return plugins.some(function (plugin) {
        return typeof plugin[methodName] === 'function' && plugin[methodName].apply(plugin, _toConsumableArray(newArgs)) === true;
      });
    };
  };

  this.createHandleHooks = function (methodName, plugins) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var newArgs = [].slice.apply(args);
      newArgs.push(_this4.getPluginMethods());

      return plugins.some(function (plugin) {
        return typeof plugin[methodName] === 'function' && plugin[methodName].apply(plugin, _toConsumableArray(newArgs)) === 'handled';
      }) ? 'handled' : 'not-handled';
    };
  };

  this.createFnHooks = function (methodName, plugins) {
    return function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var newArgs = [].slice.apply(args);

      newArgs.push(_this4.getPluginMethods());

      if (methodName === 'blockRendererFn') {
        var block = { props: {} };
        plugins.forEach(function (plugin) {
          if (typeof plugin[methodName] !== 'function') return;
          var result = plugin[methodName].apply(plugin, _toConsumableArray(newArgs));
          if (result !== undefined && result !== null) {
            var pluginProps = result.props,
                pluginRest = _objectWithoutProperties(result, ['props']); // eslint-disable-line no-use-before-define


            var _block = block,
                props = _block.props,
                rest = _objectWithoutProperties(_block, ['props']); // eslint-disable-line no-use-before-define


            block = _extends({}, rest, pluginRest, { props: _extends({}, props, pluginProps) });
          }
        });

        return block.component ? block : false;
      } else if (methodName === 'blockStyleFn') {
        var styles = void 0;
        plugins.forEach(function (plugin) {
          if (typeof plugin[methodName] !== 'function') return;
          var result = plugin[methodName].apply(plugin, _toConsumableArray(newArgs));
          if (result !== undefined && result !== null) {
            styles = (styles ? styles + ' ' : '') + result;
          }
        });

        return styles || '';
      }

      var result = void 0;
      var wasHandled = plugins.some(function (plugin) {
        if (typeof plugin[methodName] !== 'function') return false;
        result = plugin[methodName].apply(plugin, _toConsumableArray(newArgs));
        return result !== undefined;
      });
      return wasHandled ? result : false;
    };
  };

  this.createPluginHooks = function () {
    var pluginHooks = {};
    var eventHookKeys = [];
    var handleHookKeys = [];
    var fnHookKeys = [];
    var plugins = [_this4.props].concat(_toConsumableArray(_this4.resolvePlugins()));

    plugins.forEach(function (plugin) {
      Object.keys(plugin).forEach(function (attrName) {
        if (attrName === 'onChange') return;

        // if `attrName` has been added as a hook key already, ignore this one
        if (eventHookKeys.indexOf(attrName) !== -1 || fnHookKeys.indexOf(attrName) !== -1) return;

        var isEventHookKey = attrName.indexOf('on') === 0;
        if (isEventHookKey) {
          eventHookKeys.push(attrName);
          return;
        }

        var isHandleHookKey = attrName.indexOf('handle') === 0;
        if (isHandleHookKey) {
          handleHookKeys.push(attrName);
          return;
        }

        // checks if `attrName` ends with 'Fn'
        var isFnHookKey = attrName.length - 2 === attrName.indexOf('Fn');
        if (isFnHookKey) {
          fnHookKeys.push(attrName);
        }
      });
    });

    eventHookKeys.forEach(function (attrName) {
      pluginHooks[attrName] = _this4.createEventHooks(attrName, plugins);
    });

    handleHookKeys.forEach(function (attrName) {
      pluginHooks[attrName] = _this4.createHandleHooks(attrName, plugins);
    });

    fnHookKeys.forEach(function (attrName) {
      pluginHooks[attrName] = _this4.createFnHooks(attrName, plugins);
    });

    return pluginHooks;
  };

  this.resolvePlugins = function () {
    var plugins = _this4.props.plugins.slice(0);
    if (_this4.props.defaultKeyBindings) {
      plugins.push(defaultKeyBindingPlugin);
    }

    return plugins;
  };

  this.resolveCustomStyleMap = function () {
    return _this4.props.plugins.filter(function (plug) {
      return plug.customStyleMap !== undefined;
    }).map(function (plug) {
      return plug.customStyleMap;
    }).concat([_this4.props.customStyleMap]).reduce(function (styles, style) {
      return _extends({}, styles, style);
    }, {});
  };

  this.resolveblockRenderMap = function () {
    var blockRenderMap = _this4.props.plugins.filter(function (plug) {
      return plug.blockRenderMap !== undefined;
    }).reduce(function (maps, plug) {
      return maps.merge(plug.blockRenderMap);
    }, (0, _immutable.Map)({}));
    if (_this4.props.defaultBlockRenderMap) {
      blockRenderMap = _draftJs.DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }
    if (_this4.props.blockRenderMap) {
      blockRenderMap = blockRenderMap.merge(_this4.props.blockRenderMap);
    }
    return blockRenderMap;
  };

  this.resolveAccessibilityProps = function () {
    var accessibilityProps = {};
    var plugins = [_this4.props].concat(_toConsumableArray(_this4.resolvePlugins()));
    plugins.forEach(function (plugin) {
      if (typeof plugin.getAccessibilityProps !== 'function') return;
      var props = plugin.getAccessibilityProps();
      var popupProps = {};

      if (accessibilityProps.ariaHasPopup === undefined) {
        popupProps.ariaHasPopup = props.ariaHasPopup;
      } else if (props.ariaHasPopup === 'true') {
        popupProps.ariaHasPopup = 'true';
      }

      if (accessibilityProps.ariaExpanded === undefined) {
        popupProps.ariaExpanded = props.ariaExpanded;
      } else if (props.ariaExpanded === 'true') {
        popupProps.ariaExpanded = 'true';
      }

      accessibilityProps = _extends({}, accessibilityProps, props, popupProps);
    });

    return accessibilityProps;
  };
};

exports.default = PluginEditor;