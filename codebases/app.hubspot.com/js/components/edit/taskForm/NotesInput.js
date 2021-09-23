'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import { TaskNotesEditor, fromHTML, toHTML } from 'SequencesUI/util/taskNotesEditorUtils';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';

var NotesInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(NotesInput, _PureComponent);

  function NotesInput(props) {
    var _this;

    _classCallCheck(this, NotesInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NotesInput).call(this, props));
    var editorState;

    if (props.value && props.value.editorState) {
      editorState = props.value.editorState;
    } else {
      editorState = EditorState.createWithContent(fromHTML(props.value));
    }

    _this.state = {
      editorState: editorState
    };
    _this.handleEditorStateChange = _this.handleEditorStateChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NotesInput, [{
    key: "handleEditorStateChange",
    value: function handleEditorStateChange(editorState) {
      this.setState({
        editorState: editorState
      });
      this.props.onChange(SyntheticEvent({
        editorState: editorState,
        toHTML: toHTML
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var className = 'task-notes-rich-text-editor-input' + (this.state.editorState.getSelection().hasFocus ? " focused" : "");
      return /*#__PURE__*/_jsx(TaskNotesEditor, {
        className: className,
        editorState: this.state.editorState,
        onChange: this.handleEditorStateChange
      });
    }
  }]);

  return NotesInput;
}(PureComponent);

NotesInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    toHTML: PropTypes.func.isRequired
  })]).isRequired,
  onChange: PropTypes.func
};
export default NotesInput;