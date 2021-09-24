'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState, Modifier } from 'draft-js';
export default (function () {
  for (var _len = arguments.length, entityTypes = new Array(_len), _key = 0; _key < _len; _key++) {
    entityTypes[_key] = arguments[_key];
  }

  return function (WrappingComponent) {
    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return createReactClass({
        displayName: "MutableEntityWithBoundaries(" + WrappingComponent.displayName + ")",
        propTypes: {
          editorState: PropTypes.instanceOf(EditorState),
          handleBeforeInput: PropTypes.func,
          onChange: PropTypes.func.isRequired
        },
        shouldPreserveLinkEntityBoundary: function shouldPreserveLinkEntityBoundary(editorState) {
          var selection = editorState.getSelection();
          var contentState = editorState.getCurrentContent();
          var blockKey = selection.getStartKey();
          var nextCharacterIndex = selection.getStartOffset();
          var previousCharacterIndex = nextCharacterIndex - 1;

          if (previousCharacterIndex < 0) {
            return false;
          }

          var block = contentState.getBlockForKey(blockKey);
          var previousCharacterEntity = block.getEntityAt(previousCharacterIndex);
          var nextCharacterEntity = block.getEntityAt(nextCharacterIndex);
          return previousCharacterEntity !== null && nextCharacterEntity === null && entityTypes.includes(contentState.getEntity(previousCharacterEntity).getType());
        },
        handleBeforeInput: function handleBeforeInput(chars) {
          var _this$props = this.props,
              editorState = _this$props.editorState,
              handleBeforeInput = _this$props.handleBeforeInput,
              onChange = _this$props.onChange;

          if (!this.shouldPreserveLinkEntityBoundary(editorState)) {
            return handleBeforeInput && handleBeforeInput(chars);
          }

          var updatedContentState = Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), chars, editorState.getCurrentInlineStyle(), null);
          onChange(EditorState.push(editorState, updatedContentState, 'insert-characters'));
          return true;
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
          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
            ref: "child",
            handleBeforeInput: this.handleBeforeInput
          }));
        }
      });
    }

    return WrappingComponent;
  };
});