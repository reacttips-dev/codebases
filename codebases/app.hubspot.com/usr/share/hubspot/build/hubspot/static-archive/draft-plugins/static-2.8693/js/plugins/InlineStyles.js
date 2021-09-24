'use es6';
/* eslint-disable react/no-multi-comp */

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { EditorState, RichUtils } from 'draft-js';
import { createPlugin, pluginUtils } from 'draft-extend';
import { CHANGE_INLINE_STYLE } from 'rich-text-lib/constants/usageTracking';
import SmallToggleButton from 'draft-plugins/components/SmallToggleButton';
import { INLINE_STYLES } from 'draft-plugins/lib/constants';
import { removeStyles, applyStyles } from 'draft-plugins/utils/styleUtils';
import { createTracker } from '../tracking/usageTracker';
import { OrderedSet } from 'immutable';
var getSelectedInlineStyles = pluginUtils.getSelectedInlineStyles;
var Tracker;

var logInlineKeyboardShortcut = function logInlineKeyboardShortcut(style) {
  Tracker.track('draftFormatting', {
    action: CHANGE_INLINE_STYLE,
    method: 'keyboard-shortcut',
    value: style.toLowerCase()
  });
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$includedStyles = _ref.includedStyles,
      includedStyles = _ref$includedStyles === void 0 ? null : _ref$includedStyles,
      _ref$allowClearStyles = _ref.allowClearStyles,
      allowClearStyles = _ref$allowClearStyles === void 0 ? true : _ref$allowClearStyles;

  if (!Tracker) {
    Tracker = createTracker();
  }

  var createInlineStyleButton = function createInlineStyleButton(_ref2) {
    var name = _ref2.name,
        style = _ref2.style,
        icon = _ref2.icon;

    var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "draftPlugins.inlineStylesPlugin.tooltips." + name
    });

    return createReactClass({
      displayName: 'InlineStyleButton',
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
        var editorStateWithForcedSelection = EditorState.forceSelection(editorState, editorState.getSelection());

        if (editorState.getSelection().isCollapsed()) {
          var currentStyles = editorState.getCurrentInlineStyle();
          editorStateWithForcedSelection = EditorState.setInlineStyleOverride(editorStateWithForcedSelection, currentStyles);
        }

        var editorStateWithInlineStyle = RichUtils.toggleInlineStyle(editorStateWithForcedSelection, style);
        onChange(editorStateWithInlineStyle);
        Tracker.track('draftFormatting', {
          action: CHANGE_INLINE_STYLE,
          method: 'toolbar',
          value: style.toLowerCase()
        });
      },
      render: function render() {
        var _this$props2 = this.props,
            editorState = _this$props2.editorState,
            disabled = _this$props2.disabled;
        var isButtonActive;

        try {
          var isStyleActive = editorState.getCurrentInlineStyle().has(style);
          isButtonActive = !disabled && isStyleActive;
        } catch (e) {
          isButtonActive = false;
        }

        var btnClass = style ? style.toLowerCase() + "-button" : '';
        return /*#__PURE__*/_jsx(SmallToggleButton, {
          active: isButtonActive,
          className: btnClass,
          disabled: disabled,
          icon: icon,
          onClick: this.handleToggleStyle,
          tooltip: tooltip
        });
      }
    });
  };

  var clearStylesTooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "draftPlugins.inlineStylesPlugin.tooltips.clear"
  });

  var ClearStylesButton = createReactClass({
    displayName: "ClearStylesButton",
    propTypes: {
      editorState: PropTypes.object,
      onChange: PropTypes.func,
      defaultStyle: PropTypes.instanceOf(OrderedSet)
    },
    handleClearStyles: function handleClearStyles() {
      var _this$props3 = this.props,
          editorState = _this$props3.editorState,
          onChange = _this$props3.onChange,
          defaultStyle = _this$props3.defaultStyle;
      var selection = editorState.getSelection();
      var allInlineStyles = getSelectedInlineStyles(editorState);
      var newContentState = removeStyles(editorState.getCurrentContent(), selection, allInlineStyles);
      var defaultStyledContentState = applyStyles(newContentState, selection, // defaultStyle can be null, use fallback here rather in destructure
      defaultStyle || OrderedSet());
      var newEditorState = EditorState.push(editorState, defaultStyledContentState, 'change-inline-style');
      onChange(EditorState.forceSelection(newEditorState, newEditorState.getSelection()));
    },
    render: function render() {
      return /*#__PURE__*/_jsx(SmallToggleButton, {
        active: false,
        label: "Clear formatting",
        icon: 'removeTextStyle',
        onClick: this.handleClearStyles,
        tooltip: clearStylesTooltip
      });
    }
  });
  var buttons;

  if (includedStyles) {
    var styles = INLINE_STYLES.filter(function (_ref3) {
      var style = _ref3.style;
      return includedStyles.indexOf(style) !== -1;
    });
    buttons = styles.map(createInlineStyleButton);
  } else {
    buttons = INLINE_STYLES.map(createInlineStyleButton);
  }

  if (allowClearStyles) {
    buttons.push(ClearStylesButton);
  }

  var hasStyle = function hasStyle(style) {
    return includedStyles === null || includedStyles.indexOf(style) !== -1;
  };

  var keyCommandListener = function keyCommandListener(editorState, command) {
    switch (command) {
      case 'bold':
        if (hasStyle('BOLD')) {
          logInlineKeyboardShortcut('BOLD');
          return RichUtils.toggleInlineStyle(editorState, 'BOLD');
        }

        return null;

      case 'italic':
        if (hasStyle('ITALIC')) {
          logInlineKeyboardShortcut('ITALIC');
          return RichUtils.toggleInlineStyle(editorState, 'ITALIC');
        }

        return null;

      case 'underline':
        if (hasStyle('UNDERLINE')) {
          logInlineKeyboardShortcut('UNDERLINE');
          return RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
        }

        return null;

      case 'backspace':
      case 'backspace-word':
      case 'backspace-to-start-of-line':
        return RichUtils.onBackspace(editorState);

      case 'delete':
      case 'delete-word':
      case 'delete-to-end-of-block':
        return RichUtils.onDelete(editorState);

      default:
        return null;
    }
  };

  return createPlugin({
    buttons: buttons,
    keyCommandListener: keyCommandListener,
    displayName: 'InlineStyles'
  });
});