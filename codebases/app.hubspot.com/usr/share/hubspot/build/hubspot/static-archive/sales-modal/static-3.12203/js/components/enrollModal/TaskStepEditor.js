'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import { enrollmentSetStepMetadata } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import UIBox from 'UIComponents/layout/UIBox';
import UIFlex from 'UIComponents/layout/UIFlex';
import ContinueWithoutCompletionToggle from './ContinueWithoutCompletionToggle';
import TaskEditor from './TaskEditor';
import TaskSubjectEditor from './TaskSubjectEditor';
import { getIsPrimarySequence } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
var TaskStepEditor = createReactClass({
  displayName: "TaskStepEditor",
  propTypes: {
    step: PropTypes.instanceOf(ImmutableMap).isRequired,
    decks: PropTypes.instanceOf(ImmutableMap),
    email: PropTypes.string,
    isLastStep: PropTypes.bool.isRequired,
    isPrimarySequence: PropTypes.bool.isRequired,
    enrollmentSetStepMetadata: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  },
  handleChange: function handleChange(taskMeta) {
    this.props.enrollmentSetStepMetadata({
      metadata: taskMeta,
      step: this.props.step
    });
  },
  renderEditor: function renderEditor() {
    var _this$props = this.props,
        step = _this$props.step,
        decks = _this$props.decks,
        email = _this$props.email,
        readOnly = _this$props.readOnly,
        isPrimarySequence = _this$props.isPrimarySequence;
    var taskMeta = step.getIn(['actionMeta', 'taskMeta']);

    if (taskMeta.get('subject') !== null) {
      return /*#__PURE__*/_jsx(TaskSubjectEditor, {
        task: taskMeta,
        onChange: this.handleChange,
        readOnly: readOnly || isPrimarySequence
      });
    }

    return /*#__PURE__*/_jsx(TaskEditor, {
      task: taskMeta,
      decks: decks,
      email: email,
      onChange: this.handleChange,
      readOnly: readOnly || isPrimarySequence
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        step = _this$props2.step,
        isLastStep = _this$props2.isLastStep,
        readOnly = _this$props2.readOnly;
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "end",
      className: "task-details",
      justify: "between",
      children: [/*#__PURE__*/_jsx(UIBox, {
        grow: 1,
        className: "task-step-editor m-right-6",
        children: this.renderEditor()
      }), /*#__PURE__*/_jsx(UIBox, {
        children: /*#__PURE__*/_jsx(ContinueWithoutCompletionToggle, {
          step: step,
          isLastStep: isLastStep,
          readOnly: readOnly
        })
      })]
    });
  }
});
export default connect(function (state) {
  return {
    isPrimarySequence: getIsPrimarySequence(state)
  };
}, {
  enrollmentSetStepMetadata: enrollmentSetStepMetadata
})(TaskStepEditor);