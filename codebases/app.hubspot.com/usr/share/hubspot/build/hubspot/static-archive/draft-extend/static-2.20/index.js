"use es6";

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, getDefaultKeyBinding, Editor as Editor$1, CompositeDecorator, Entity, SelectionState, Modifier, ContentBlock, genKey, BlockMapBuilder } from 'draft-js';
import { List, Map, OrderedSet, Set } from 'immutable';
import ReactDOM from 'react-dom';
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
};

var invariant_1 = invariant;
var providedProps = {
  addKeyCommandListener: PropTypes.func,
  removeKeyCommandListener: PropTypes.func,
  handleKeyCommand: PropTypes.func
};

var KeyCommandController = function KeyCommandController(Component) {
  var KeyCommand = /*#__PURE__*/function (_React$Component) {
    _inherits(KeyCommand, _React$Component);

    function KeyCommand(props) {
      var _this;

      _classCallCheck(this, KeyCommand);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(KeyCommand).call(this, props));
      _this.addKeyCommandListener = _this.addKeyCommandListener.bind(_assertThisInitialized(_this));
      _this.removeKeyCommandListener = _this.removeKeyCommandListener.bind(_assertThisInitialized(_this));
      _this.handleKeyCommand = _this.handleKeyCommand.bind(_assertThisInitialized(_this));
      _this.focus = _this.focus.bind(_assertThisInitialized(_this));
      _this.blur = _this.blur.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(KeyCommand, [{
      key: "UNSAFE_componentWillMount",
      value: function UNSAFE_componentWillMount() {
        this.keyCommandOverrides = List(this.props.keyCommandListeners);
        this.keyCommandListeners = List();
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        // ensure valid props for deferral
        var propNames = Object.keys(providedProps);
        var presentProps = propNames.filter(function (propName) {
          return _this2.props[propName] !== undefined;
        });
        var nonePresent = presentProps.length === 0;
        var allPresent = presentProps.length === propNames.length;
        invariant_1(nonePresent || allPresent, "KeyCommandController: A KeyCommandController is receiving only some props (" + presentProps.join(', ') + ") necessary to defer to a parent key command controller.");

        if (allPresent) {
          this.props.keyCommandListeners.forEach(function (listener) {
            _this2.props.addKeyCommandListener(listener);
          });
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this3 = this;

        if (this.props.removeKeyCommandListener) {
          this.props.keyCommandListeners.forEach(function (listener) {
            _this3.props.removeKeyCommandListener(listener);
          });
        }
      }
    }, {
      key: "addKeyCommandListener",
      value: function addKeyCommandListener(listener) {
        var addKeyCommandListener = this.props.addKeyCommandListener;

        if (addKeyCommandListener) {
          addKeyCommandListener(listener);
          return;
        }

        this.keyCommandListeners = this.keyCommandListeners.unshift(listener);
      }
    }, {
      key: "removeKeyCommandListener",
      value: function removeKeyCommandListener(listener) {
        var removeKeyCommandListener = this.props.removeKeyCommandListener;

        if (removeKeyCommandListener) {
          removeKeyCommandListener(listener);
          return;
        }

        this.keyCommandListeners = this.keyCommandListeners.filterNot(function (l) {
          return l === listener;
        });
      }
    }, {
      key: "handleKeyCommand",
      value: function handleKeyCommand(command) {
        var keyboardEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var _this$props = this.props,
            editorState = _this$props.editorState,
            onChange = _this$props.onChange,
            handleKeyCommand = _this$props.handleKeyCommand;

        if (handleKeyCommand) {
          return handleKeyCommand(command, keyboardEvent);
        }

        var result = this.keyCommandListeners.concat(this.keyCommandOverrides).reduce(function (_ref, listener) {
          var state = _ref.state,
              hasChanged = _ref.hasChanged;

          if (hasChanged === true) {
            return {
              state: state,
              hasChanged: hasChanged
            };
          }

          var listenerResult = listener(state, command, keyboardEvent);
          var isEditorState = listenerResult instanceof EditorState;

          if (listenerResult === true || isEditorState && listenerResult !== state) {
            if (isEditorState) {
              onChange(listenerResult);
              return {
                state: listenerResult,
                hasChanged: true
              };
            }

            return {
              state: state,
              hasChanged: true
            };
          }

          return {
            state: state,
            hasChanged: hasChanged
          };
        }, {
          state: editorState,
          hasChanged: false
        });
        return result.hasChanged;
      }
    }, {
      key: "focus",
      value: function focus() {
        this.refs.editor.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        this.refs.editor.blur();
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            editorState = _this$props2.editorState,
            onChange = _this$props2.onChange,
            keyCommandListeners = _this$props2.keyCommandListeners,
            others = _objectWithoutProperties(_this$props2, ["editorState", "onChange", "keyCommandListeners"]);

        return /*#__PURE__*/React.createElement(Component, Object.assign({}, others, {
          ref: "editor",
          editorState: editorState,
          onChange: onChange,
          addKeyCommandListener: this.addKeyCommandListener,
          removeKeyCommandListener: this.removeKeyCommandListener,
          handleKeyCommand: this.handleKeyCommand
        }));
      }
    }]);

    return KeyCommand;
  }(React.Component);

  KeyCommand.displayName = "KeyCommandController(" + Component.displayName + ")";
  KeyCommand.propTypes = Object.assign({
    editorState: PropTypes.object,
    onChange: PropTypes.func,
    keyCommandListeners: PropTypes.arrayOf(PropTypes.func)
  }, providedProps);
  KeyCommand.defaultProps = {
    keyCommandListeners: []
  };
  return KeyCommand;
};

var OverlayWrapper = /*#__PURE__*/function (_React$Component2) {
  _inherits(OverlayWrapper, _React$Component2);

  function OverlayWrapper(props) {
    var _this4;

    _classCallCheck(this, OverlayWrapper);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(OverlayWrapper).call(this, props));
    var node = document.createElement('div');
    document.body.appendChild(node);
    _this4.state = {
      node: node
    };
    return _this4;
  }

  _createClass(OverlayWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.renderOverlay();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.renderOverlay();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(this.state.node);
    }
  }, {
    key: "renderOverlay",
    value: function renderOverlay() {
      var child = React.Children.only(this.props.children);
      ReactDOM.render(child, this.state.node);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return OverlayWrapper;
}(React.Component);

var propTypes = {
  className: PropTypes.string,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  decorators: PropTypes.array,
  baseDecorator: PropTypes.func,
  styleMap: PropTypes.object,
  styleFn: PropTypes.func,
  buttons: PropTypes.array,
  overlays: PropTypes.array,
  blockRendererFn: PropTypes.func,
  blockStyleFn: PropTypes.func,
  keyBindingFn: PropTypes.func,
  addKeyCommandListener: PropTypes.func.isRequired,
  removeKeyCommandListener: PropTypes.func.isRequired,
  handleReturn: PropTypes.func,
  onEscape: PropTypes.func,
  onTab: PropTypes.func,
  onUpArrow: PropTypes.func,
  onDownArrow: PropTypes.func,
  readOnly: PropTypes.bool,
  showButtons: PropTypes.bool,
  renderTray: PropTypes.func
};

var EditorWrapper = /*#__PURE__*/function (_React$Component3) {
  _inherits(EditorWrapper, _React$Component3);

  function EditorWrapper(props) {
    var _this5;

    _classCallCheck(this, EditorWrapper);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(EditorWrapper).call(this, props));
    var baseDecorator = props.baseDecorator;
    var decorator = new baseDecorator(props.decorators);
    _this5.state = {
      decorator: decorator,
      readOnly: false
    };
    _this5.keyBindingFn = _this5.keyBindingFn.bind(_assertThisInitialized(_this5));
    _this5.handleReturn = _this5.handleReturn.bind(_assertThisInitialized(_this5));
    _this5.onEscape = _this5.onEscape.bind(_assertThisInitialized(_this5));
    _this5.onTab = _this5.onTab.bind(_assertThisInitialized(_this5));
    _this5.onUpArrow = _this5.onUpArrow.bind(_assertThisInitialized(_this5));
    _this5.onDownArrow = _this5.onDownArrow.bind(_assertThisInitialized(_this5));
    _this5.focus = _this5.focus.bind(_assertThisInitialized(_this5));
    _this5.blur = _this5.blur.bind(_assertThisInitialized(_this5));
    _this5.getOtherProps = _this5.getOtherProps.bind(_assertThisInitialized(_this5));
    _this5.getReadOnly = _this5.getReadOnly.bind(_assertThisInitialized(_this5));
    _this5.setReadOnly = _this5.setReadOnly.bind(_assertThisInitialized(_this5));
    _this5.getDecoratedState = _this5.getDecoratedState.bind(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(EditorWrapper, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        getEditorState: this.getDecoratedState,
        getReadOnly: this.getReadOnly,
        setReadOnly: this.setReadOnly,
        onChange: this.props.onChange,
        focus: this.focus,
        blur: this.blur,
        editorRef: this.refs.editor
      };
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.decorators.length === this.state.decorator._decorators.length) {
        var allDecoratorsMatch = this.state.decorator._decorators.every(function (decorator, i) {
          return decorator === nextProps.decorators[i];
        });

        if (allDecoratorsMatch) {
          return;
        }
      }

      this.setState({
        decorator: new nextProps.baseDecorator(nextProps.decorators)
      });
    }
  }, {
    key: "keyBindingFn",
    value: function keyBindingFn(e) {
      var pluginsCommand = this.props.keyBindingFn(e);

      if (pluginsCommand) {
        return pluginsCommand;
      }

      return getDefaultKeyBinding(e);
    }
  }, {
    key: "handleReturn",
    value: function handleReturn(e, editorState) {
      return this.props.handleReturn && this.props.handleReturn(e, editorState) || this.props.handleKeyCommand('return', e);
    }
  }, {
    key: "onEscape",
    value: function onEscape(e) {
      return this.props.onEscape && this.props.onEscape(e) || this.props.handleKeyCommand('escape', e);
    }
  }, {
    key: "onTab",
    value: function onTab(e) {
      return this.props.onTab && this.props.onTab(e) || this.props.handleKeyCommand('tab', e);
    }
  }, {
    key: "onUpArrow",
    value: function onUpArrow(e) {
      return this.props.onUpArrow && this.props.onUpArrow(e) || this.props.handleKeyCommand('up-arrow', e);
    }
  }, {
    key: "onDownArrow",
    value: function onDownArrow(e) {
      return this.props.onDownArrow && this.props.onDownArrow(e) || this.props.handleKeyCommand('down-arrow', e);
    }
  }, {
    key: "focus",
    value: function focus() {
      this.refs.editor.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.refs.editor.blur();
    }
  }, {
    key: "getOtherProps",
    value: function getOtherProps() {
      var _this6 = this;

      var propKeys = Object.keys(this.props);
      var propTypeKeys = Object.keys(propTypes);
      var propsToPass = propKeys.filter(function (prop) {
        return propTypeKeys.indexOf(prop) === -1;
      });
      return propsToPass.reduce(function (acc, prop) {
        acc[prop] = _this6.props[prop];
        return acc;
      }, {});
    }
  }, {
    key: "getReadOnly",
    value: function getReadOnly() {
      return this.state.readOnly || this.props.readOnly;
    }
  }, {
    key: "setReadOnly",
    value: function setReadOnly(readOnly) {
      this.setState({
        readOnly: readOnly
      });
    }
  }, {
    key: "getDecoratedState",
    value: function getDecoratedState() {
      var editorState = this.props.editorState;
      var decorator = this.state.decorator;
      var currentDecorator = editorState.getDecorator();

      if (currentDecorator && currentDecorator._decorators === decorator._decorators) {
        return editorState;
      }

      return EditorState.set(editorState, {
        decorator: decorator
      });
    }
  }, {
    key: "renderTray",
    value: function renderTray() {
      var renderTray = this.props.renderTray;

      if (typeof renderTray !== 'function') {
        return null;
      }

      return renderTray();
    }
  }, {
    key: "renderPluginButtons",
    value: function renderPluginButtons() {
      var _this7 = this;

      var _this$props3 = this.props,
          onChange = _this$props3.onChange,
          addKeyCommandListener = _this$props3.addKeyCommandListener,
          removeKeyCommandListener = _this$props3.removeKeyCommandListener,
          showButtons = _this$props3.showButtons;

      if (showButtons === false) {
        return null;
      }

      var decoratedState = this.getDecoratedState();
      return this.props.buttons.map(function (Button, index) {
        return /*#__PURE__*/React.createElement(Button, Object.assign({}, _this7.getOtherProps(), {
          key: "button-" + index,
          attachedToEditor: true,
          editorState: decoratedState,
          onChange: onChange,
          addKeyCommandListener: addKeyCommandListener,
          removeKeyCommandListener: removeKeyCommandListener
        }));
      });
    }
  }, {
    key: "renderOverlays",
    value: function renderOverlays() {
      var _this8 = this;

      var _this$props4 = this.props,
          onChange = _this$props4.onChange,
          addKeyCommandListener = _this$props4.addKeyCommandListener,
          removeKeyCommandListener = _this$props4.removeKeyCommandListener;
      var decoratedState = this.getDecoratedState();
      return this.props.overlays.map(function (Overlay, index) {
        return /*#__PURE__*/React.createElement(OverlayWrapper, {
          key: index
        }, /*#__PURE__*/React.createElement(Overlay, Object.assign({}, _this8.getOtherProps(), {
          editorState: decoratedState,
          onChange: onChange,
          addKeyCommandListener: addKeyCommandListener,
          removeKeyCommandListener: removeKeyCommandListener
        })));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          styleMap = _this$props5.styleMap,
          styleFn = _this$props5.styleFn,
          blockRendererFn = _this$props5.blockRendererFn,
          blockStyleFn = _this$props5.blockStyleFn,
          onChange = _this$props5.onChange,
          handleKeyCommand = _this$props5.handleKeyCommand,
          otherProps = _objectWithoutProperties(_this$props5, ["styleMap", "styleFn", "blockRendererFn", "blockStyleFn", "onChange", "handleKeyCommand"]);

      var decoratedState = this.getDecoratedState();
      var className = "draft-extend " + this.props.className;
      var readOnly = this.getReadOnly();
      return /*#__PURE__*/React.createElement("div", {
        className: className
      }, /*#__PURE__*/React.createElement("div", {
        className: "draft-extend-editor"
      }, /*#__PURE__*/React.createElement(Editor$1, Object.assign({}, otherProps, {
        ref: "editor",
        editorState: decoratedState,
        readOnly: readOnly,
        onChange: onChange,
        blockStyleFn: blockStyleFn,
        blockRendererFn: blockRendererFn,
        customStyleMap: styleMap,
        customStyleFn: styleFn,
        handleKeyCommand: handleKeyCommand,
        keyBindingFn: this.keyBindingFn,
        handleReturn: this.handleReturn,
        onEscape: this.onEscape,
        onTab: this.onTab,
        onUpArrow: this.onUpArrow,
        onDownArrow: this.onDownArrow
      })), /*#__PURE__*/React.createElement("div", {
        className: "draft-extend-tray"
      }, this.renderTray()), /*#__PURE__*/React.createElement("div", {
        className: "draft-extend-controls"
      }, this.renderPluginButtons()), /*#__PURE__*/React.createElement("div", {
        className: "draft-extend-overlays"
      }, this.renderOverlays())));
    }
  }]);

  return EditorWrapper;
}(React.Component);

EditorWrapper.propTypes = propTypes;
EditorWrapper.defaultProps = {
  className: '',
  editorState: EditorState.createEmpty(),
  onChange: function onChange() {},
  decorators: [],
  baseDecorator: CompositeDecorator,
  styleMap: {},
  styleFn: function styleFn() {},
  buttons: [],
  overlays: [],
  blockRendererFn: function blockRendererFn() {},
  blockStyleFn: function blockStyleFn() {},
  keyBindingFn: function keyBindingFn() {},
  readOnly: false,
  showButtons: true
};
EditorWrapper.childContextTypes = {
  getEditorState: PropTypes.func,
  getReadOnly: PropTypes.func,
  setReadOnly: PropTypes.func,
  onChange: PropTypes.func,
  focus: PropTypes.func,
  blur: PropTypes.func,
  editorRef: PropTypes.object
};
var Editor = KeyCommandController(EditorWrapper);

var Toolbar = /*#__PURE__*/function (_React$Component4) {
  _inherits(Toolbar, _React$Component4);

  function Toolbar(props) {
    var _this9;

    _classCallCheck(this, Toolbar);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Toolbar).call(this, props));
    _this9.getEditorState = _this9.getEditorState.bind(_assertThisInitialized(_this9));
    return _this9;
  }

  _createClass(Toolbar, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        getEditorState: this.getEditorState,
        onChange: this.props.onChange
      };
    }
  }, {
    key: "getEditorState",
    value: function getEditorState() {
      return this.props.editorState;
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      var _this$props6 = this.props,
          editorState = _this$props6.editorState,
          onChange = _this$props6.onChange,
          buttons = _this$props6.buttons,
          addKeyCommandListener = _this$props6.addKeyCommandListener,
          removeKeyCommandListener = _this$props6.removeKeyCommandListener,
          otherProps = _objectWithoutProperties(_this$props6, ["editorState", "onChange", "buttons", "addKeyCommandListener", "removeKeyCommandListener"]);

      return buttons.map(function (Button, index) {
        return /*#__PURE__*/React.createElement(Button, Object.assign({}, otherProps, {
          key: "button-" + index,
          editorState: editorState,
          onChange: onChange,
          addKeyCommandListener: addKeyCommandListener,
          removeKeyCommandListener: removeKeyCommandListener
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("ul", {
        className: "draft-extend-controls"
      }, this.renderButtons());
    }
  }]);

  return Toolbar;
}(React.Component);

Toolbar.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  buttons: PropTypes.array,
  addKeyCommandListener: PropTypes.func.isRequired,
  removeKeyCommandListener: PropTypes.func.isRequired
};
Toolbar.childContextTypes = {
  getEditorState: PropTypes.func,
  onChange: PropTypes.func
};
var Toolbar$1 = KeyCommandController(Toolbar); // used to memoize accumulated options when rendering plugin wrapper components.

function memoize(func) {
  var _cache = Map();

  return function () {
    var argList = List.of.apply(List, arguments);

    if (!_cache.has(argList)) {
      _cache = _cache.set(argList, func.apply(void 0, arguments));
    }

    return _cache.get(argList);
  };
}

var compose = function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function () {
    if (funcs.length === 0) {
      return arguments.length <= 0 ? undefined : arguments[0];
    }

    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(void 0, arguments));
  };
}; // plain objects with `{start, end}` values and non-HOF functions that return
// either a String or ReactElement


var middlewareAdapter = function middlewareAdapter(middleware) {
  if (middleware && middleware.__isMiddleware) {
    return middleware;
  }

  return function (next) {
    return function () {
      if (typeof middleware === 'object') {
        // handle old blockToHTML objects
        var block = arguments.length <= 0 ? undefined : arguments[0];
        var objectResult;

        if (typeof block === 'string') {
          // handle case of inline style value
          var style = block;

          if (process.env.NODE_ENV === 'development') {
            console.warn('styleToHTML: Use of plain objects to define HTML output is being deprecated. Please switch to using functions that return a {start, end} object or ReactElement.');
          }

          objectResult = middleware[style];
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('blockToHTML: Use of plain objects to define HTML output is being deprecated. Please switch to using functions that return a {start, end} object or ReactElement.');
          }

          objectResult = middleware[block.type];
        } // check for inline style value instead of a raw block


        if (objectResult !== null && objectResult !== undefined) {
          return objectResult;
        }

        return next.apply(void 0, arguments);
      }

      var returnValue;

      try {
        // try immediately giving the function the content data in case it's a simple
        // function that doesn't expect a `next` function
        var nonMiddlewareResult = middleware.apply(void 0, arguments);

        if (nonMiddlewareResult === null || nonMiddlewareResult === undefined) {
          // the behavior for non-middleware functions is to delegate by returning
          // `null` or `undefined`, so do delegation for them
          returnValue = next.apply(void 0, arguments);
        } else if (arguments.length === 2 && typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'string' && (arguments.length <= 1 ? undefined : arguments[1]) === nonMiddlewareResult) {
          // entityToHTML option returned `originalText`, i.e. no change was made
          returnValue = next.apply(void 0, arguments);
        } else if (Array.isArray(nonMiddlewareResult)) {
          // returned an array from a textToEntity function, concat with next
          returnValue = nonMiddlewareResult.concat(next.apply(void 0, arguments));
        } else if (OrderedSet.isOrderedSet(nonMiddlewareResult)) {
          var _ref2;

          // returned an OrderedSet from htmlToStyle, pass to next as third argument
          var previousStyles = (_ref2 = arguments.length - 1, _ref2 < 0 || arguments.length <= _ref2 ? undefined : arguments[_ref2]);
          returnValue = previousStyles.union(nonMiddlewareResult).union(next.apply(void 0, arguments));
        } else if (typeof nonMiddlewareResult === 'function') {
          // most middleware HOFs will return another function when invoked, so we
          // can assume that it is one here
          returnValue = middleware(next).apply(void 0, arguments);
        } else {
          // the function was a simple non-middleware function and
          // returned a reasonable value, so return its result
          returnValue = nonMiddlewareResult;
        }
      } catch (e) {
        // it's possible that trying to use a middleware function like a simple non-
        // middleware function will throw, so try it as a middleware HOF
        returnValue = middleware(next).apply(void 0, arguments);
      } finally {
        return returnValue;
      }
    };
  };
}; // utility function to accumulate the common plugin option function pattern of
// handling args by returning a non-null result or delegate to other plugins


var emptyFunction = function emptyFunction() {};

var accumulateFunction = function accumulateFunction(newFn) {
  var acc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;

  if (!newFn) {
    return acc;
  }

  return function () {
    var result = newFn.apply(void 0, arguments);

    if (result === null || result === undefined) {
      return acc.apply(void 0, arguments);
    }

    return result;
  };
};

var emptyFunction$1 = function emptyFunction$1() {};

var emptyArray = [];
var emptyObject = {};
var memoizedAccumulateFunction = memoize(accumulateFunction);
var memoizedAssign = memoize(function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return Object.assign.apply(Object, [{}].concat(args));
});
var memoizedConcat = memoize(function (a1, a2) {
  return a1.concat(a2);
});
var memoizedCoerceArray = memoize(function () {
  var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return Array.isArray(arg) ? arg : [arg];
});

var accumulatePluginOptions = function accumulatePluginOptions(accumulation, pluginConfig) {
  var accumulationWithDefaults = Object.assign({
    styleMap: emptyObject,
    styleFn: emptyFunction$1,
    decorators: emptyArray,
    buttons: emptyArray,
    overlays: emptyArray,
    blockRendererFn: emptyFunction$1,
    blockStyleFn: emptyFunction$1,
    keyBindingFn: emptyFunction$1,
    keyCommandListeners: emptyArray
  }, accumulation);
  var styleMap = pluginConfig.styleMap,
      styleFn = pluginConfig.styleFn,
      decorators = pluginConfig.decorators,
      buttons = pluginConfig.buttons,
      overlays = pluginConfig.overlays,
      blockRendererFn = pluginConfig.blockRendererFn,
      blockStyleFn = pluginConfig.blockStyleFn,
      keyBindingFn = pluginConfig.keyBindingFn,
      keyCommandListener = pluginConfig.keyCommandListener;
  var keyCommandListeners = memoizedConcat(accumulationWithDefaults.keyCommandListeners, memoizedCoerceArray(keyCommandListener));
  return Object.assign({}, accumulationWithDefaults, {
    styleMap: memoizedAssign(accumulationWithDefaults.styleMap, styleMap),
    styleFn: memoizedAccumulateFunction(accumulationWithDefaults.styleFn, styleFn),
    decorators: memoizedConcat(accumulationWithDefaults.decorators, decorators),
    buttons: memoizedConcat(accumulationWithDefaults.buttons, buttons),
    overlays: memoizedConcat(accumulationWithDefaults.overlays, overlays),
    blockRendererFn: memoizedAccumulateFunction(blockRendererFn, accumulationWithDefaults.blockRendererFn),
    blockStyleFn: memoizedAccumulateFunction(blockStyleFn, accumulationWithDefaults.blockStyleFn),
    keyBindingFn: memoizedAccumulateFunction(keyBindingFn, accumulationWithDefaults.keyBindingFn),
    // `createPlugin` expects a singular `keyCommandListener`, but Editor
    // component props expect the plural `keyCommandListeners`, so return both
    // since this is used in both contexts
    keyCommandListeners: keyCommandListeners,
    keyCommandListener: keyCommandListeners
  });
};

var emptyFunction$2 = function emptyFunction$2() {};

var emptyArray$1 = [];
var emptyObject$1 = {};

var defaultMiddlewareFunction = function defaultMiddlewareFunction(next) {
  return function () {
    return next.apply(void 0, arguments);
  };
};

defaultMiddlewareFunction.__isMiddleware = true;
var memoizedCoerceArray$1 = memoize(function (arg) {
  return Array.isArray(arg) ? arg : [arg];
});
var memoizedPassEmptyStyles = memoize(function (func) {
  return function (nodeName, node) {
    return func(nodeName, node, OrderedSet());
  };
});

var createPlugin = function createPlugin(_ref3) {
  var _ref3$displayName = _ref3.displayName,
      displayName = _ref3$displayName === void 0 ? 'Plugin' : _ref3$displayName,
      _ref3$decorators = _ref3.decorators,
      decorators = _ref3$decorators === void 0 ? emptyArray$1 : _ref3$decorators,
      _ref3$buttons = _ref3.buttons,
      buttons = _ref3$buttons === void 0 ? emptyArray$1 : _ref3$buttons,
      _ref3$overlays = _ref3.overlays,
      overlays = _ref3$overlays === void 0 ? emptyArray$1 : _ref3$overlays,
      _ref3$styleMap = _ref3.styleMap,
      styleMap = _ref3$styleMap === void 0 ? emptyObject$1 : _ref3$styleMap,
      _ref3$styleFn = _ref3.styleFn,
      styleFn = _ref3$styleFn === void 0 ? emptyFunction$2 : _ref3$styleFn,
      _ref3$blockRendererFn = _ref3.blockRendererFn,
      blockRendererFn = _ref3$blockRendererFn === void 0 ? emptyFunction$2 : _ref3$blockRendererFn,
      _ref3$blockStyleFn = _ref3.blockStyleFn,
      blockStyleFn = _ref3$blockStyleFn === void 0 ? emptyFunction$2 : _ref3$blockStyleFn,
      _ref3$keyBindingFn = _ref3.keyBindingFn,
      keyBindingFn = _ref3$keyBindingFn === void 0 ? emptyFunction$2 : _ref3$keyBindingFn,
      _ref3$keyCommandListe = _ref3.keyCommandListener,
      keyCommandListener = _ref3$keyCommandListe === void 0 ? emptyFunction$2 : _ref3$keyCommandListe,
      _ref3$htmlToStyle = _ref3.htmlToStyle,
      htmlToStyle = _ref3$htmlToStyle === void 0 ? defaultMiddlewareFunction : _ref3$htmlToStyle,
      _ref3$htmlToBlock = _ref3.htmlToBlock,
      htmlToBlock = _ref3$htmlToBlock === void 0 ? defaultMiddlewareFunction : _ref3$htmlToBlock,
      _ref3$htmlToEntity = _ref3.htmlToEntity,
      htmlToEntity = _ref3$htmlToEntity === void 0 ? defaultMiddlewareFunction : _ref3$htmlToEntity,
      _ref3$textToEntity = _ref3.textToEntity,
      textToEntity = _ref3$textToEntity === void 0 ? defaultMiddlewareFunction : _ref3$textToEntity,
      _ref3$styleToHTML = _ref3.styleToHTML,
      styleToHTML = _ref3$styleToHTML === void 0 ? defaultMiddlewareFunction : _ref3$styleToHTML,
      _ref3$blockToHTML = _ref3.blockToHTML,
      blockToHTML = _ref3$blockToHTML === void 0 ? defaultMiddlewareFunction : _ref3$blockToHTML,
      _ref3$entityToHTML = _ref3.entityToHTML,
      entityToHTML = _ref3$entityToHTML === void 0 ? defaultMiddlewareFunction : _ref3$entityToHTML;
  return function (ToWrap) {
    decorators = memoizedCoerceArray$1(decorators);
    buttons = memoizedCoerceArray$1(buttons);
    overlays = memoizedCoerceArray$1(overlays);

    if (ToWrap.prototype && ToWrap.prototype.isReactComponent) {
      // wrapping an Editor component
      var Plugin = /*#__PURE__*/function (_React$Component5) {
        _inherits(Plugin, _React$Component5);

        function Plugin(props) {
          var _this10;

          _classCallCheck(this, Plugin);

          _this10 = _possibleConstructorReturn(this, _getPrototypeOf(Plugin).call(this, props));
          _this10.focus = _this10.focus.bind(_assertThisInitialized(_this10));
          _this10.blur = _this10.blur.bind(_assertThisInitialized(_this10));
          return _this10;
        }

        _createClass(Plugin, [{
          key: "focus",
          value: function focus() {
            if (this.refs.child.focus) {
              this.refs.child.focus();
            }
          }
        }, {
          key: "blur",
          value: function blur() {
            if (this.refs.child.blur) {
              this.refs.child.blur();
            }
          }
        }, {
          key: "render",
          value: function render() {
            var pluginAccumulation = accumulatePluginOptions({
              styleMap: this.props.styleMap,
              styleFn: this.props.styleFn,
              decorators: this.props.decorators,
              buttons: this.props.buttons,
              overlays: this.props.overlays,
              blockRendererFn: this.props.blockRendererFn,
              blockStyleFn: this.props.blockStyleFn,
              keyBindingFn: this.props.keyBindingFn,
              keyCommandListeners: this.props.keyCommandListeners
            }, {
              styleMap: styleMap,
              styleFn: styleFn,
              decorators: decorators,
              buttons: buttons,
              overlays: overlays,
              blockRendererFn: blockRendererFn,
              blockStyleFn: blockStyleFn,
              keyBindingFn: keyBindingFn,
              keyCommandListener: keyCommandListener
            }); // keyCommandListener isn't used by the Editor component or other plugin
            // HOCs but keyCommandListeners is

            var __keyCommandListener = pluginAccumulation.__keyCommandListener,
                editorPluginOptions = _objectWithoutProperties(pluginAccumulation, ["__keyCommandListener"]);

            return /*#__PURE__*/React.createElement(ToWrap, Object.assign({}, this.props, {
              ref: "child"
            }, editorPluginOptions));
          }
        }]);

        return Plugin;
      }(React.Component);

      Plugin.displayName = displayName;
      Plugin.propTypes = {
        styleMap: PropTypes.object,
        styleFn: PropTypes.func,
        decorators: PropTypes.array,
        buttons: PropTypes.array,
        overlays: PropTypes.array,
        blockRendererFn: PropTypes.func,
        blockStyleFn: PropTypes.func,
        keyBindingFn: PropTypes.func,
        keyCommandListeners: PropTypes.arrayOf(PropTypes.func)
      };
      Plugin.defaultProps = {
        styleMap: emptyObject$1,
        styleFn: emptyFunction$2,
        decorators: emptyArray$1,
        buttons: emptyArray$1,
        overlays: emptyArray$1,
        blockRendererFn: emptyFunction$2,
        blockStyleFn: emptyFunction$2,
        keyBindingFn: emptyFunction$2,
        keyCommandListeners: emptyArray$1
      };
      return Plugin;
    } else if (ToWrap && ToWrap.__isAccumulator) {
      return accumulatePluginOptions(ToWrap, {
        styleMap: styleMap,
        styleFn: styleFn,
        decorators: decorators,
        buttons: buttons,
        overlays: overlays,
        blockRendererFn: blockRendererFn,
        blockStyleFn: blockStyleFn,
        keyBindingFn: keyBindingFn,
        keyCommandListener: keyCommandListener
      });
    } else {
      // wrapping a converter function
      return function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        if (args.length === 1 && (typeof args[0] === 'string' || args[0].hasOwnProperty('_map') && args[0].getBlockMap != null)) {
          // actively converting an HTML string/ContentState, so pass additional options to the next converter function.
          return ToWrap({
            htmlToStyle: htmlToStyle,
            htmlToBlock: htmlToBlock,
            htmlToEntity: htmlToEntity,
            textToEntity: textToEntity,
            styleToHTML: styleToHTML,
            blockToHTML: blockToHTML,
            entityToHTML: entityToHTML
          }).apply(void 0, args);
        } else {
          // receiving a plugin to accumulate upon for a converter - accumulate
          // options and return a new plugin wrapped around the passed one ready
          // to take either another plugin or a string/ContentState
          var oldOptions = args[0];
          var newHTMLToStyle = compose(middlewareAdapter(memoizedPassEmptyStyles(htmlToStyle)), middlewareAdapter(oldOptions.htmlToStyle));
          newHTMLToStyle.__isMiddleware = true;
          var newHTMLToBlock = compose(middlewareAdapter(htmlToBlock), middlewareAdapter(oldOptions.htmlToBlock));
          newHTMLToBlock.__isMiddleware = true;
          var newHTMLToEntity = compose(middlewareAdapter(htmlToEntity), middlewareAdapter(oldOptions.htmlToEntity));
          newHTMLToEntity.__isMiddleware = true;
          var newTextToEntity = compose(middlewareAdapter(textToEntity), middlewareAdapter(oldOptions.textToEntity));
          newTextToEntity.__isMiddleware = true;
          var newStyleToHTML = compose(middlewareAdapter(styleToHTML), middlewareAdapter(oldOptions.styleToHTML));
          newStyleToHTML.__isMiddleware = true;
          var newBlockToHTML = compose(middlewareAdapter(blockToHTML), middlewareAdapter(oldOptions.blockToHTML));
          newBlockToHTML.__isMiddleware = true;
          var newEntityToHTML = compose(middlewareAdapter(entityToHTML), middlewareAdapter(oldOptions.entityToHTML));
          newEntityToHTML.__isMiddleware = true;
          return createPlugin({
            htmlToStyle: newHTMLToStyle,
            htmlToBlock: newHTMLToBlock,
            htmlToEntity: newHTMLToEntity,
            textToEntity: newTextToEntity,
            styleToHTML: newStyleToHTML,
            blockToHTML: newBlockToHTML,
            entityToHTML: newEntityToHTML
          })(ToWrap);
        }
      };
    }
  };
};

var camelCaseToHyphen = function camelCaseToHyphen(camelCase) {
  return camelCase.replace(/[a-z][A-Z]/g, function (str) {
    return str[0] + '-' + str[1].toLowerCase();
  });
};

var getActiveEntity = function getActiveEntity(editorState) {
  var currentBlock = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey());

  if (currentBlock) {
    return currentBlock.getEntityAt(editorState.getSelection().getStartOffset());
  }
};

var utils = {
  camelCaseToHyphen: camelCaseToHyphen,
  styleObjectToString: function styleObjectToString(styles) {
    return Object.keys(styles).map(function (styleName) {
      return camelCaseToHyphen(styleName) + ": " + styles[styleName] + ";";
    }).join(' ').replace(/"/g, '\\"');
  },
  entityStrategy: function entityStrategy(entityType) {
    return function (contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(function (character) {
        var entityKey = character.getEntity();

        if (entityKey === null) {
          return false;
        }

        var entity = contentState && contentState.getEntity ? contentState.getEntity(entityKey) : Entity.get(entityKey);
        return entity && entity.getType() === entityType;
      }, callback);
    };
  },
  getEntitySelection: function getEntitySelection(editorState, entityKey) {
    var selections = [];
    editorState.getCurrentContent().getBlocksAsArray().forEach(function (block) {
      block.findEntityRanges(function (c) {
        return c.getEntity() === entityKey;
      }, function (start, end) {
        selections.push(SelectionState.createEmpty(block.getKey()).merge({
          anchorOffset: start,
          focusOffset: end,
          isBackward: false,
          hasFocus: true
        }));
      });
    });
    invariant_1(selections.length === 1, 'getEntitySelection: More than one range with the same entityKey. Please use unique entity instances');
    return selections[0];
  },
  insertBlockAtCursor: function insertBlockAtCursor(editorState, block) {
    var contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');
    var targetSelection = afterRemoval.getSelectionAfter();
    var afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
    var insertionTarget = afterSplit.getSelectionAfter();
    var asType = Modifier.setBlockType(afterSplit, insertionTarget, block.getType());
    var fragmentArray = [block, new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List()
    })];
    var fragment = BlockMapBuilder.createFromArray(fragmentArray);
    var withBlock = Modifier.replaceWithFragment(asType, insertionTarget, fragment);
    var newContent = withBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true)
    });
    return EditorState.push(editorState, newContent, 'insert-fragment');
  },
  getSelectedInlineStyles: function getSelectedInlineStyles(editorState) {
    var selection = editorState.getSelection();
    var contentState = editorState.getCurrentContent();
    var blocks = contentState.getBlockMap().skipUntil(function (value, key) {
      return key === selection.getStartKey();
    }).takeUntil(function (value, key) {
      return contentState.getKeyBefore(key) === selection.getEndKey();
    });
    return blocks.reduce(function (styles, block) {
      var blockKey = block.getKey();
      var start = 0;
      var end = block.getLength() - 1;

      if (blockKey === selection.getStartKey()) {
        start = selection.getStartOffset();
      }

      if (blockKey === selection.getEndKey()) {
        end = selection.getEndOffset();
      }

      for (var i = start; i <= end; i++) {
        styles = styles.union(block.getInlineStyleAt(i));
      }

      return styles;
    }, Set());
  },
  matchAll: function matchAll(string, regex) {
    var result = [];
    var matchArray = regex.exec(string);

    while (matchArray !== null) {
      result.push(matchArray.concat([matchArray.index]));
      matchArray = regex.exec(string);
    }

    return result;
  },
  getActiveEntity: getActiveEntity,
  isEntityActive: function isEntityActive(editorState, entityType) {
    var activeEntityKey = getActiveEntity(editorState);
    var contentState = editorState.getCurrentContent();

    if (activeEntityKey) {
      var entity = contentState.getEntity ? contentState.getEntity(activeEntityKey) : Entity.get(activeEntityKey);
      return entity && entity.type === entityType;
    }

    return false;
  }
};
export { Editor, KeyCommandController, Toolbar$1 as Toolbar, accumulatePluginOptions, compose, createPlugin, utils as pluginUtils };