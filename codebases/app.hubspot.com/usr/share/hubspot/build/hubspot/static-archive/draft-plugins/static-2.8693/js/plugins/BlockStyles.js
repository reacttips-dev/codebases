'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { EditorState, RichUtils } from 'draft-js';
import { createPlugin } from 'draft-extend';
import { CHANGE_BLOCK_FORMAT, MAKE_ORDERED_LIST, MAKE_UNORDERED_LIST } from 'rich-text-lib/constants/usageTracking';
import SmallToggleButton from '../components/SmallToggleButton';
import { HEADER_TYPES, LIST_TYPES, MISC_TYPES } from '../lib/constants';
import { createTracker } from '../tracking/usageTracker';
import handleListTabs from '../utils/handleListTabs';
var Tracker;
var LIST_TYPES_TO_TRACKING_ACTIONS = {
  'ordered-list-item': MAKE_ORDERED_LIST,
  'unordered-list-item': MAKE_UNORDERED_LIST
};

var getTrackingData = function getTrackingData(style) {
  var listTrackingAction = LIST_TYPES_TO_TRACKING_ACTIONS[style];

  if (listTrackingAction) {
    return {
      action: listTrackingAction,
      method: 'toolbar'
    };
  }

  return {
    action: CHANGE_BLOCK_FORMAT,
    method: 'toolbar',
    value: style
  };
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$listStyles = _ref.listStyles,
      listStyles = _ref$listStyles === void 0 ? null : _ref$listStyles,
      _ref$headerStyles = _ref.headerStyles,
      headerStyles = _ref$headerStyles === void 0 ? null : _ref$headerStyles,
      _ref$miscStyles = _ref.miscStyles,
      miscStyles = _ref$miscStyles === void 0 ? null : _ref$miscStyles;

  if (!Tracker) {
    Tracker = createTracker();
  }

  var createBlockStyleButton = function createBlockStyleButton(_ref2) {
    var label = _ref2.label,
        style = _ref2.style,
        name = _ref2.name,
        icon = _ref2.icon;

    var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "draftPlugins.blockStyle.tooltips." + name
    });

    var BlockStyleButton = createReactClass({
      displayName: "BlockStyleButton",
      propTypes: {
        disabled: PropTypes.bool,
        editorState: PropTypes.object,
        onChange: PropTypes.func
      },
      getDefaultProps: function getDefaultProps() {
        return {
          disabled: false
        };
      },
      handleToggleStyle: function handleToggleStyle() {
        var _this$props = this.props,
            editorState = _this$props.editorState,
            onChange = _this$props.onChange;
        var newState = RichUtils.toggleBlockType(editorState, style);
        onChange(EditorState.forceSelection(newState, newState.getSelection()));
        Tracker.track('draftFormatting', getTrackingData(style.toLowerCase()));
      },
      render: function render() {
        var _this$props2 = this.props,
            editorState = _this$props2.editorState,
            disabled = _this$props2.disabled;
        var currentBlockStyle = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType();
        var isStyleActive = currentBlockStyle === style;
        var btnClass = 'draft-toolbar-button' + (style ? " " + style.toLowerCase() + "-button" : "");
        var isButtonActive = !disabled && isStyleActive;
        return /*#__PURE__*/_jsx(SmallToggleButton, {
          active: isButtonActive,
          className: btnClass,
          disabled: disabled,
          label: label,
          icon: icon,
          onClick: this.handleToggleStyle,
          tooltip: tooltip
        });
      }
    });
    return BlockStyleButton;
  };

  var buttons = [];

  if (Array.isArray(listStyles)) {
    var styles = LIST_TYPES.filter(function (style) {
      return listStyles.indexOf(style.style) !== -1;
    });
    buttons.push.apply(buttons, _toConsumableArray(styles.map(createBlockStyleButton)));
  } else {
    buttons.push.apply(buttons, _toConsumableArray(LIST_TYPES.map(createBlockStyleButton)));
  }

  if (Array.isArray(headerStyles)) {
    var _styles = HEADER_TYPES.filter(function (style) {
      return headerStyles.indexOf(style.style) !== -1;
    });

    buttons.push.apply(buttons, _toConsumableArray(_styles.map(createBlockStyleButton)));
  } else {
    buttons.push.apply(buttons, _toConsumableArray(HEADER_TYPES.map(createBlockStyleButton)));
  }

  if (Array.isArray(miscStyles)) {
    var _styles2 = MISC_TYPES.filter(function (style) {
      return miscStyles.indexOf(style.style) !== -1;
    });

    buttons.push.apply(buttons, _toConsumableArray(_styles2.map(createBlockStyleButton)));
  } else {
    buttons.push.apply(buttons, _toConsumableArray(MISC_TYPES.map(createBlockStyleButton)));
  }

  return createPlugin({
    keyCommandListener: handleListTabs,
    buttons: buttons,
    displayName: 'BlockStyles',
    blockToHTML: function blockToHTML(block) {
      switch (block.type) {
        case 'blockquote':
          return /*#__PURE__*/_jsx("blockquote", {});

        case 'code-block':
          return /*#__PURE__*/_jsx("pre", {});

        default:
          return undefined;
      }
    }
  });
});