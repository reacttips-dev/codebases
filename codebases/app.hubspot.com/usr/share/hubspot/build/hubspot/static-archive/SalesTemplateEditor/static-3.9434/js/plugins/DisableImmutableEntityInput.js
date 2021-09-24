'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState } from 'draft-js';

var isEntityImmutable = function isEntityImmutable(entity) {
  return entity.getMutability() === 'IMMUTABLE';
};

export default (function () {
  return function (WrappingComponent) {
    if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
      return createReactClass({
        propTypes: {
          editorState: PropTypes.instanceOf(EditorState),
          handleBeforeInput: PropTypes.func,
          onChange: PropTypes.func.isRequired
        },
        handleBeforeInput: function handleBeforeInput(chars) {
          var _this$props = this.props,
              editorState = _this$props.editorState,
              handleBeforeInput = _this$props.handleBeforeInput;
          var selection = editorState.getSelection();
          var contentState = editorState.getCurrentContent();

          if (selection.isCollapsed()) {
            var blockKey = selection.getStartKey();
            var index = selection.getFocusOffset();
            var currentBlock = contentState.getBlockForKey(blockKey);
            var entityKey = currentBlock.getEntityAt(index);
            var precedingEntityKey = currentBlock.getEntityAt(index - 1);

            if (entityKey && entityKey === precedingEntityKey && isEntityImmutable(contentState.getEntity(entityKey))) {
              return true;
            }
          }

          return handleBeforeInput && handleBeforeInput(chars);
        },
        focus: function focus() {
          if (this._child.focus) {
            this._child.focus();
          }
        },
        blur: function blur() {
          if (this._child.blur) {
            this._child.blur();
          }
        },
        render: function render() {
          var _this = this;

          return /*#__PURE__*/_jsx(WrappingComponent, Object.assign({}, this.props, {
            ref: function ref(c) {
              return _this._child = c;
            },
            handleBeforeInput: this.handleBeforeInput
          }));
        }
      });
    }

    return WrappingComponent;
  };
});