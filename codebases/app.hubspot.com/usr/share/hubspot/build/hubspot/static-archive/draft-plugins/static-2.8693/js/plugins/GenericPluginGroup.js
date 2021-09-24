'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { compose, accumulatePluginOptions } from 'draft-extend';
import SmallToggleButton from '../components/SmallToggleButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIList from 'UIComponents/list/UIList';
import { memoize } from '../lib/utils';
import { createPluginStack } from './createPluginStack';
var memoizedImmutablePush = memoize(function (a1, a2) {
  return a1.concat([a2]);
});
var createGroupedButton = memoize(function () {
  var icon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'textColor';
  var tooltip = arguments.length > 1 ? arguments[1] : undefined;
  var tooltipPlacement = arguments.length > 2 ? arguments[2] : undefined;
  var inline = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var className = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var onOpenPopover = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {};
  var buttons = arguments.length > 6 ? arguments[6] : undefined;
  var useDropdown = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
  var dropdownText = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : '';
  return createReactClass({
    displayName: 'GroupedButton',
    propTypes: {
      onChange: PropTypes.func,
      editorState: PropTypes.object.isRequired
    },
    getInitialState: function getInitialState() {
      return {
        open: false
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      this.keyDownHandler = function (evt) {
        var target = evt.target;

        if (target.className.includes('public-DraftEditor-content')) {
          // user is typing in their content, close the popover so it's not
          // distracting
          _this.handlePopoverClose();
        }
      };

      document.addEventListener('keydown', this.keyDownHandler);
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.keyDownHandler) {
        document.removeEventListener('keydown', this.keyDownHandler);
      }
    },
    handlePopoverClose: function handlePopoverClose() {
      this.setState({
        open: false
      });
    },
    togglePopover: function togglePopover() {
      this.setState(function (_ref) {
        var open = _ref.open;

        if (!open && onOpenPopover) {
          onOpenPopover();
        }

        return {
          open: !open
        };
      });
    },
    handleOpenChange: function handleOpenChange(e) {
      this.setState({
        open: e.target.value
      });
    },
    renderButtons: function renderButtons() {
      var _this2 = this;

      return buttons.map(function (Button, index) {
        return /*#__PURE__*/_jsx(Button, Object.assign({
          closePopover: _this2.handlePopoverClose
        }, _this2.props), index);
      });
    },
    renderButtonList: function renderButtonList() {
      return /*#__PURE__*/_jsx(UIList, {
        className: className,
        childClassName: "p-x-0",
        inline: inline,
        children: this.renderButtons()
      });
    },
    render: function render() {
      var open = this.state.open;

      if (!buttons) {
        return null;
      }

      var sharedProps = {
        open: this.state.open,
        closeOnOutsideClick: true,
        onOpenChange: this.handleOpenChange,
        placement: 'top right'
      };

      if (useDropdown) {
        return /*#__PURE__*/_jsx(UIDropdown, Object.assign({}, sharedProps, {
          buttonClassName: "draft-toolbar-dropdown",
          buttonUse: "transparent",
          buttonText: dropdownText,
          className: "draft-toolbar-group",
          closeOnMenuClick: false,
          Content: this.renderButtonList
        }));
      }

      return /*#__PURE__*/_jsx(UIPopover, Object.assign({}, sharedProps, {
        Content: this.renderButtonList,
        children: /*#__PURE__*/_jsx(SmallToggleButton, {
          className: "plugin-group-button",
          active: open,
          icon: icon,
          onClick: this.togglePopover,
          tooltip: tooltip,
          tooltipPlacement: tooltipPlacement
        })
      }));
    }
  });
});

var addGroupedButtons = function addGroupedButtons(WrappingComponent, options) {
  // eslint-disable-next-line react/no-multi-comp
  return createReactClass({
    propTypes: {
      buttons: PropTypes.array.isRequired,
      otherButtons: PropTypes.array.isRequired
    },
    focus: function focus() {
      if (this.refs.child.focus) {
        this.refs.child.focus();
      }
    },
    blur: function blur() {
      if (this.refs.child.blur) {
        this.refs.child.blur();
      }
    },
    render: function render() {
      var _this$props = this.props,
          buttons = _this$props.buttons,
          otherButtons = _this$props.otherButtons,
          otherProps = _objectWithoutProperties(_this$props, ["buttons", "otherButtons"]);

      var icon = options.icon,
          tooltip = options.tooltip,
          tooltipPlacement = options.tooltipPlacement,
          inline = options.inline,
          className = options.className,
          onOpenPopover = options.onOpenPopover,
          useDropdown = options.useDropdown,
          dropdownText = options.dropdownText;
      var GroupedButton = createGroupedButton(icon, tooltip, tooltipPlacement, inline, className, onOpenPopover, buttons, useDropdown, dropdownText);
      var allButtons = memoizedImmutablePush(otherButtons, GroupedButton);
      return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({
        ref: "child",
        buttons: allButtons
      }, otherProps));
    }
  });
};

export default (function (plugins) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // try to turn the passed plugins into a single plugin stack. if that works,
  // we can do so and change the buttons to be a single grouped one. if not, we
  // need to keep plugins separate to preserve plugin order.
  var pluginStack = createPluginStack.apply(void 0, _toConsumableArray(plugins));
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

  if (plugins.length === 0) {
    return function (WrappingComponent) {
      return WrappingComponent;
    };
  }

  return function (WrappingComponent) {
    if (WrappingComponent && WrappingComponent.__isAccumulator && canCombineGroupedPlugins) {
      var _pluginProps = pluginProps,
          buttons = _pluginProps.buttons,
          otherPluginProps = _objectWithoutProperties(_pluginProps, ["buttons"]);

      var icon = options.icon,
          tooltip = options.tooltip,
          tooltipPlacement = options.tooltipPlacement,
          inline = options.inline,
          className = options.className,
          onOpenPopover = options.onOpenPopover,
          useDropdown = options.useDropdown,
          dropdownText = options.dropdownText;
      var GroupedButton = createGroupedButton(icon, tooltip, tooltipPlacement, inline, className, onOpenPopover, buttons, useDropdown, dropdownText);
      var groupedButtonConfig = Object.assign({
        buttons: [GroupedButton]
      }, otherPluginProps);
      return Object.assign({}, accumulatePluginOptions(WrappingComponent, groupedButtonConfig), {
        __pluginStack: plugins.length + "(GenericPluginGroupStack)"
      });
    }

    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      var buttonGrouper = options.addGroupedButtons || addGroupedButtons; // wrapping Editor component, so accumulate rendering options on a single GroupedButton

      var WrappedEditorWithGroupedButtons = compose.apply(void 0, _toConsumableArray(plugins))(buttonGrouper(WrappingComponent, options)); // eslint-disable-next-line react/no-multi-comp

      return createReactClass({
        propTypes: {
          buttons: PropTypes.array
        },
        getDefaultProps: function getDefaultProps() {
          return {
            buttons: []
          };
        },
        focus: function focus() {
          if (this.refs.child.focus) {
            this.refs.child.focus();
          }
        },
        blur: function blur() {
          if (this.refs.child.blur) {
            this.refs.child.blur();
          }
        },
        render: function render() {
          var _this$props2 = this.props,
              buttons = _this$props2.buttons,
              otherProps = _objectWithoutProperties(_this$props2, ["buttons"]);

          return /*#__PURE__*/_jsx(WrappedEditorWithGroupedButtons, Object.assign({}, otherProps, {
            ref: "child",
            otherButtons: buttons
          }));
        }
      });
    } // not an Editor component, so accumulate as usual


    return compose.apply(void 0, _toConsumableArray(plugins))(WrappingComponent);
  };
});