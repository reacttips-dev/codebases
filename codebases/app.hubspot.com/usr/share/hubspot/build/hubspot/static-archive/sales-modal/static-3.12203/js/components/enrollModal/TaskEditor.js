'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import blockRenderMap from './utils/blockRenderMap';
import { getTaskBodyEditor } from 'sales-modal/redux/selectors/TaskEditorSelectors';
var TaskEditor = createReactClass({
  displayName: "TaskEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    task: PropTypes.instanceOf(ImmutableMap).isRequired,
    decks: PropTypes.instanceOf(ImmutableMap),
    email: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    BodyEditor: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  },
  onBodyChange: function onBodyChange(bodyState) {
    var _this$props = this.props,
        task = _this$props.task,
        onChange = _this$props.onChange;
    onChange(task.set('notes', bodyState));
  },
  render: function render() {
    var _this$props2 = this.props,
        task = _this$props2.task,
        decks = _this$props2.decks,
        email = _this$props2.email,
        BodyEditor = _this$props2.BodyEditor,
        readOnly = _this$props2.readOnly;
    return /*#__PURE__*/_jsxs("div", {
      className: "task-editor",
      children: [/*#__PURE__*/_jsx(UIFormLabel, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentEditor.body.taskEditor.title"
        })
      }), /*#__PURE__*/_jsx(BodyEditor, {
        editorState: task.get('notes'),
        onChange: this.onBodyChange,
        blockRenderMap: blockRenderMap,
        decks: decks,
        contactEmail: email,
        spellCheck: true,
        readOnly: readOnly
      })]
    });
  }
});
export default connect(function (state, ownProps) {
  return {
    BodyEditor: getTaskBodyEditor(state, ownProps)
  };
})(TaskEditor);