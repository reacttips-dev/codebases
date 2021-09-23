'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Fragment, Component } from 'react';
import { compose, accumulatePluginOptions } from 'draft-extend';
import { EERIE, CALYPSO } from 'HubStyleTokens/colors';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIList from 'UIComponents/list/UIList';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { createPluginStack } from '../createPluginStack';
import InlineInsertHeader from './InlineInsertHeader';
var MENU = 'menu';
var PLUGIN_TO_ICON = {
  documents: 'documents',
  knowledgeArticles: 'cap',
  meetings: 'meetings',
  signature: 'signature',
  snippets: 'textSnippet',
  video: 'insertVideo'
};

var createInsertPopover = function createInsertPopover(componentsConfig, callbacksConfig, trackingConfig) {
  var popoverContentComponents = Object.keys(componentsConfig).reduce(function (acc, pluginName) {
    acc[pluginName] = componentsConfig[pluginName].component;
    return acc;
  }, {});
  var popoverContentCallbacks = Object.keys(callbacksConfig).reduce(function (acc, pluginName) {
    acc[pluginName] = callbacksConfig[pluginName].callback;
    return acc;
  }, {});
  var popoverClickTrackers = Object.keys(trackingConfig).reduce(function (acc, pluginName) {
    acc[pluginName] = trackingConfig[pluginName].trackClick;
    return acc;
  }, {});

  var InsertPopover = /*#__PURE__*/function (_Component) {
    _inherits(InsertPopover, _Component);

    function InsertPopover() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, InsertPopover);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(InsertPopover)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.state = {
        open: false,
        popoverMode: MENU
      };

      _this.handleClose = function () {
        _this.setState({
          open: false,
          popoverMode: MENU
        });
      };

      _this.handleBackClick = function () {
        _this.setState({
          popoverMode: MENU
        });
      };

      _this.getHandleMenuClick = function (pluginName) {
        return function () {
          if (popoverClickTrackers[pluginName]) {
            popoverClickTrackers[pluginName]();
          }

          if (popoverContentCallbacks[pluginName]) {
            popoverContentCallbacks[pluginName]();

            _this.handleClose();
          } else {
            _this.setState({
              popoverMode: pluginName
            });
          }
        };
      };

      _this.renderMenuButton = function (pluginName) {
        var iconName = PLUGIN_TO_ICON[pluginName];
        return /*#__PURE__*/_jsxs(UIButton, {
          className: "insert-popover-button display-flex align-center justify-between",
          onClick: _this.getHandleMenuClick(pluginName),
          children: [/*#__PURE__*/_jsxs("span", {
            children: [iconName && /*#__PURE__*/_jsx(UIIcon, {
              className: "m-right-3",
              name: iconName,
              color: EERIE
            }), /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.insertGroupPlugin." + pluginName
            })]
          }), popoverContentComponents[pluginName] && /*#__PURE__*/_jsx(UIIcon, {
            name: "right",
            color: CALYPSO
          })]
        }, pluginName);
      };

      _this.renderPopoverContent = function () {
        var popoverMode = _this.state.popoverMode;

        if (popoverMode === MENU) {
          var pluginNames = Object.keys(componentsConfig).concat(Object.keys(callbacksConfig));
          return /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("p", {
              className: "p-x-5 m-bottom-2 m-top-4 is--heading-7",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "draftPlugins.insertGroupPlugin.popoverButtonText"
              })
            }), /*#__PURE__*/_jsx(UIList, {
              children: pluginNames.map(_this.renderMenuButton)
            })]
          });
        }

        var Content = popoverContentComponents[popoverMode];
        return /*#__PURE__*/_jsxs(Fragment, {
          children: [/*#__PURE__*/_jsx(InlineInsertHeader, {
            onBackClick: _this.handleBackClick,
            mode: popoverMode
          }), /*#__PURE__*/_jsx(Content, Object.assign({
            onClose: _this.handleClose,
            open: true,
            showHeader: false
          }, _this.props))]
        });
      };

      return _this;
    }

    _createClass(InsertPopover, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$state = this.state,
            open = _this$state.open,
            popoverMode = _this$state.popoverMode;
        return /*#__PURE__*/_jsx(UIPopover, {
          content: this.renderPopoverContent(),
          width: popoverMode === MENU ? 350 : 450,
          onCloseComplete: function onCloseComplete() {
            return _this2.setState({
              popoverMode: MENU
            });
          },
          onOpenChange: function onOpenChange(e) {
            return _this2.setState({
              open: e.target.value
            });
          },
          open: open,
          children: /*#__PURE__*/_jsxs(UIButton, {
            onClick: function onClick() {
              _this2.setState(function (prevState) {
                return {
                  open: !prevState.open
                };
              });
            },
            use: "transparent",
            children: [/*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.insertGroupPlugin.popoverButtonText"
            }), /*#__PURE__*/_jsx(UIDropdownCaret, {
              className: "m-left-2"
            })]
          })
        });
      }
    }]);

    return InsertPopover;
  }(Component);

  return InsertPopover;
};

var insertPopoverCreator = function insertPopoverCreator(WrappingComponent, InsertPopover) {
  var _class, _temp;

  // eslint-disable-next-line react/no-multi-comp
  return _temp = _class = /*#__PURE__*/function (_Component2) {
    _inherits(_class, _Component2);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "focus",
      value: function focus() {
        if (this._child.focus) {
          this._child.focus();
        }
      }
    }, {
      key: "blur",
      value: function blur() {
        if (this._child.blur) {
          this._child.blur();
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props = this.props,
            __buttons = _this$props.buttons,
            nonInsertButtons = _this$props.nonInsertButtons,
            rest = _objectWithoutProperties(_this$props, ["buttons", "nonInsertButtons"]);

        return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({
          ref: function ref(child) {
            _this3._child = child;
          },
          buttons: [].concat(_toConsumableArray(nonInsertButtons), [InsertPopover])
        }, rest));
      }
    }]);

    return _class;
  }(Component), _class.displayName = 'WithInsertButton', _class.propTypes = {
    buttons: PropTypes.array.isRequired,
    nonInsertButtons: PropTypes.array.isRequired
  }, _temp;
};

export default (function (config) {
  var pluginsToCompose = Object.keys(config).reduce(function (acc, pluginName) {
    var plugin = config[pluginName].plugin;

    if (plugin) {
      // some plugins only provide a button (and not blockToHtml, etc.)
      // so we don't need to pass them in for composition
      acc.push(plugin);
    }

    return acc;
  }, []); // try to turn the passed plugins into a single plugin stack. if that works,
  // we can do so and change the buttons to be a single grouped one. if not, we
  // need to keep plugins separate to preserve plugin order.

  var pluginStack = createPluginStack.apply(void 0, _toConsumableArray(pluginsToCompose));
  var stackSets = pluginStack({
    __isAccumulator: true
  });
  var canCombineGroupedPlugins = stackSets.length === 1;
  var pluginProps = null;

  if (canCombineGroupedPlugins) {
    var _stackSets = _slicedToArray(stackSets, 1),
        firstPluginStack = _stackSets[0];

    pluginProps = firstPluginStack({
      __isAccumulator: true
    });
  }

  var componentsConfig = Object.keys(config).reduce(function (acc, pluginName) {
    if (config[pluginName].component) {
      acc[pluginName] = config[pluginName];
    }

    return acc;
  }, {});
  var callbacksConfig = Object.keys(config).reduce(function (acc, pluginName) {
    if (config[pluginName].callback) {
      acc[pluginName] = config[pluginName];
    }

    return acc;
  }, {});
  var trackingConfig = Object.keys(config).reduce(function (acc, pluginName) {
    if (config[pluginName].trackClick) {
      acc[pluginName] = config[pluginName];
    }

    return acc;
  }, {});
  var InsertPopover = createInsertPopover(componentsConfig, callbacksConfig, trackingConfig);

  if (pluginsToCompose.length === 0) {
    return function (WrappingComponent) {
      return WrappingComponent;
    };
  }

  return function (WrappingComponent) {
    if (WrappingComponent && WrappingComponent.__isAccumulator && canCombineGroupedPlugins) {
      var _pluginProps = pluginProps,
          __buttons = _pluginProps.buttons,
          otherPluginProps = _objectWithoutProperties(_pluginProps, ["buttons"]);

      var insertButtonConfig = Object.assign({
        buttons: [InsertPopover]
      }, otherPluginProps);
      return Object.assign({}, accumulatePluginOptions(WrappingComponent, insertButtonConfig), {
        __pluginStack: pluginsToCompose.length + "(InsertGroupPluginStack)"
      });
    }

    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      var _class2, _temp2;

      var WrappedEditorWithInsertButton = compose.apply(void 0, _toConsumableArray(pluginsToCompose))(insertPopoverCreator(WrappingComponent, InsertPopover)); // eslint-disable-next-line react/no-multi-comp

      return _temp2 = _class2 = /*#__PURE__*/function (_Component3) {
        _inherits(_class2, _Component3);

        function _class2() {
          _classCallCheck(this, _class2);

          return _possibleConstructorReturn(this, _getPrototypeOf(_class2).apply(this, arguments));
        }

        _createClass(_class2, [{
          key: "focus",
          value: function focus() {
            if (this._child.focus) {
              this._child.focus();
            }
          }
        }, {
          key: "blur",
          value: function blur() {
            if (this._child.blur) {
              this._child.blur();
            }
          }
        }, {
          key: "render",
          value: function render() {
            var _this4 = this;

            var _this$props2 = this.props,
                buttons = _this$props2.buttons,
                rest = _objectWithoutProperties(_this$props2, ["buttons"]);

            return /*#__PURE__*/_jsx(WrappedEditorWithInsertButton, Object.assign({
              nonInsertButtons: buttons,
              ref: function ref(c) {
                _this4._child = c;
              }
            }, rest));
          }
        }]);

        return _class2;
      }(Component), _class2.displayName = 'EditorWithoutInsertifiedButtons', _temp2;
    }

    return compose.apply(void 0, _toConsumableArray(pluginsToCompose))(WrappingComponent);
  };
});