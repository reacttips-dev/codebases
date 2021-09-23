'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
var TaskSubjectEditor = createReactClass({
  displayName: "TaskSubjectEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    task: PropTypes.instanceOf(ImmutableMap).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  },
  handleSubjectChange: function handleSubjectChange(_ref) {
    var value = _ref.target.value;
    var _this$props = this.props,
        task = _this$props.task,
        onChange = _this$props.onChange;
    onChange(task.set('subject', value));
  },
  render: function render() {
    var _this$props2 = this.props,
        readOnly = _this$props2.readOnly,
        task = _this$props2.task;
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollmentEditor.body.taskEditor.title"
      }),
      children: /*#__PURE__*/_jsx(UITextInput, {
        className: "task-subject-editor",
        readOnly: readOnly,
        value: task.get('subject'),
        onChange: this.handleSubjectChange
      })
    });
  }
});
export default TaskSubjectEditor;