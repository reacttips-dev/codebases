'use es6';
/* eslint-disable react/no-multi-comp */

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { Map as ImmutableMap } from 'immutable';
import { EditorState, Modifier } from 'draft-js';
import { createPlugin } from 'draft-extend';
import { createTracker } from '../tracking/usageTracker';
import { CHANGE_INLINE_STYLE } from 'rich-text-lib/constants/usageTracking';
import UITextToolbarIconDropdown from 'UIComponents/editor/UITextToolbarIconDropdown';
var ALIGNMENT_TYPES = ['left', 'center', 'right'];
var Tracker;

var getAlignmentOption = function getAlignmentOption(alignmentType) {
  var capitalizedType = "" + alignmentType.charAt(0).toUpperCase() + alignmentType.slice(1);
  var icon = "align" + capitalizedType;
  return {
    icon: icon,
    value: alignmentType,
    'data-test-id': "align-" + alignmentType
  };
};

var toggleStyle = function toggleStyle(type, editorState) {
  var newBlockData = ImmutableMap({
    align: type
  });
  var currentContent = editorState.getCurrentContent();
  var newContentState = Modifier.mergeBlockData(currentContent, editorState.getSelection(), newBlockData);
  return EditorState.push(editorState, newContentState, 'change-block-data');
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$tagName = _ref.tagName,
      tagName = _ref$tagName === void 0 ? 'p' : _ref$tagName,
      tooltipPlacement = _ref.tooltipPlacement,
      empty = _ref.empty;

  if (!Tracker) {
    Tracker = createTracker();
  }

  var tooltip = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "draftPlugins.alignmentPlugin.tooltips.align"
  });

  var dropdownOptions = ALIGNMENT_TYPES.map(getAlignmentOption);
  var PureUITextToolbarIconDropdown = createReactClass({
    displayName: "PureUITextToolbarIconDropdown",
    mixins: [PureRenderMixin],
    render: function render() {
      return /*#__PURE__*/_jsx(UITextToolbarIconDropdown, Object.assign({
        "data-test-id": "block-alignment-dropdown"
      }, this.props));
    }
  });
  var AlignmentDropdown = createReactClass({
    displayName: "AlignmentDropdown",
    propTypes: {
      editorState: PropTypes.object,
      onChange: PropTypes.func
    },
    handleChange: function handleChange(e) {
      var _this$props = this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange;
      var newAlignment = e.target.value;
      Tracker.track('draftFormatting', {
        action: CHANGE_INLINE_STYLE,
        method: 'toolbar',
        value: "align-" + newAlignment.toLowerCase()
      });
      var contentStateWithStyle = toggleStyle(newAlignment, editorState);
      onChange(contentStateWithStyle);
    },
    render: function render() {
      return /*#__PURE__*/_jsx(PureUITextToolbarIconDropdown, {
        className: "draft-toolbar-button",
        options: dropdownOptions,
        defaultValue: ALIGNMENT_TYPES[0],
        tooltip: tooltip,
        placement: tooltipPlacement,
        onChange: this.handleChange
      });
    }
  });

  var blockStyleFn = function blockStyleFn(block) {
    var alignType = block.data.get('align');
    var blockType = block.getType();

    if (alignType !== undefined && blockType === 'unstyled') {
      return "draft-extend-align-block-" + alignType;
    }

    return '';
  };

  var blockToHTML = function blockToHTML(block) {
    var align = block.data.align;
    var type = block.type;

    if (align !== undefined && align !== '' && type === 'unstyled') {
      var tagObject = {
        start: "<" + tagName + " style=\"text-align: " + align + "\">",
        end: "</" + tagName + ">",
        nestStart: '',
        nestEnd: ''
      };

      if (empty) {
        if (block.text.length > 0 && block.text.trim().length === 0) {
          return empty;
        }

        tagObject.empty = empty;
      }

      return tagObject;
    }

    return undefined;
  };

  var htmlToBlock = function htmlToBlock(nodeName, node) {
    var align;

    if (node.style) {
      align = node.style.textAlign;
    }

    nodeName = nodeName.toLowerCase();
    var isAlignTag = (nodeName === 'p' || nodeName === 'div') && align !== undefined && align !== null && align !== '';

    if (isAlignTag) {
      return {
        type: 'unstyled',
        data: {
          align: align
        }
      };
    }

    return undefined;
  };

  var keyCommandListener = function keyCommandListener(editorState, command) {
    if (command === 'return') {
      var currentContent = editorState.getCurrentContent();
      var currentSelection = editorState.getSelection();
      var currentBlock = currentContent.getBlockForKey(editorState.getSelection().getStartKey());
      var currentBlockAlignment = currentBlock.getData().get('align');

      if (currentBlockAlignment !== undefined) {
        var newBlockData = ImmutableMap({
          align: currentBlockAlignment
        });
        var splitContentState = Modifier.splitBlock(currentContent, currentSelection);
        var splitStateSelectionAfter = splitContentState.getSelectionAfter();
        var newContentState = Modifier.mergeBlockData(splitContentState, splitStateSelectionAfter, newBlockData);
        var newState = EditorState.push(editorState, newContentState, 'split-block');
        return EditorState.forceSelection(newState, splitStateSelectionAfter);
      }
    }

    return undefined;
  };

  return createPlugin({
    displayName: 'BlockStyles',
    buttons: AlignmentDropdown,
    blockStyleFn: blockStyleFn,
    blockToHTML: blockToHTML,
    htmlToBlock: htmlToBlock,
    keyCommandListener: keyCommandListener
  });
});