'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Set as ImmutableSet } from 'immutable';
import { EditorState, SelectionState, Modifier } from 'draft-js';
export default (function (ToWrap) {
  if (ToWrap.prototype && ToWrap.prototype.isReactComponent) {
    return createReactClass({
      propTypes: {
        onChange: PropTypes.func.isRequired
      },
      handleOnChange: function handleOnChange(editorState) {
        var selectionBefore = editorState.getCurrentContent().getSelectionBefore();
        var selectionAfter = editorState.getCurrentContent().getSelectionAfter();
        var contentState = editorState.getCurrentContent();
        var allStyles = ImmutableSet();
        contentState.getBlocksAsArray().forEach(function (block) {
          allStyles = block.characterList.reduce(function (set, character) {
            return set.union(character.getStyle());
          }, allStyles);
        });
        var allSelection = SelectionState.createEmpty(contentState.getFirstBlock().getKey()).merge({
          focusKey: contentState.getLastBlock().getKey(),
          focusOffset: contentState.getLastBlock().getLength()
        });
        var newContentState = allStyles.reduce(function (acc, style) {
          return Modifier.removeInlineStyle(acc, allSelection, style);
        }, contentState).merge({
          selectionBefore: selectionBefore,
          selectionAfter: selectionAfter
        });
        this.props.onChange(EditorState.push(editorState, newContentState, 'change-inline-style'));
      },
      render: function render() {
        return /*#__PURE__*/_jsx(ToWrap, Object.assign({}, this.props, {
          onChange: this.handleOnChange
        }));
      }
    });
  }

  return ToWrap;
});