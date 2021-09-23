'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionPropsType from '../../grid/utils/BulkActionPropsType';
import MakeConnectedAPIDropdownProvider from 'customer-data-reference-ui-components/connector/MakeConnectedAPIDropdownProvider';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import I18n from 'I18n';
import createReactClass from 'create-react-class';
import { WORKFLOW } from 'reference-resolvers/constants/ReferenceObjectTypes';
import WorkflowReferenceResolver from 'reference-resolvers/resolvers/WorkflowReferenceResolver';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UIFormControl from 'UIComponents/form/UIFormControl';
var WorkflowsSelect = MakeConnectedAPIDropdownProvider({
  referenceObjectType: WORKFLOW,
  referenceResolver: WorkflowReferenceResolver
});
export default createReactClass({
  displayName: 'BulkEnrollInWorkflowDialog',
  propTypes: Object.assign({
    bulkActionProps: BulkActionPropsType.isRequired
  }, PromptablePropInterface),
  getInitialState: function getInitialState() {
    return {
      value: null
    };
  },
  handleChange: function handleChange(_ref) {
    var value = _ref.target.value;
    return this.setState({
      value: value
    });
  },
  handleConfirm: function handleConfirm(e) {
    e.preventDefault();
    this.props.onConfirm({
      workflowId: parseInt(this.state.value, 10)
    });
  },
  render: function render() {
    var bulkActionProps = this.props.bulkActionProps;
    var value = this.state.value;
    var objectCount = bulkActionProps.get('selectionCount');
    return /*#__PURE__*/_jsx(BaseDialog, {
      title: I18n.text('enrollInWorkflowModal.title', {
        count: objectCount
      }),
      confirmLabel: I18n.text('enrollInWorkflowModal.buttonText'),
      confirmDisabled: !value,
      onConfirm: this.handleConfirm,
      onReject: this.props.onReject,
      children: /*#__PURE__*/_jsx("form", {
        onSubmit: this.handleConfirm,
        children: /*#__PURE__*/_jsx(UIFormControl, {
          label: I18n.text('enrollInWorkflowModal.message', {
            count: objectCount
          }),
          children: /*#__PURE__*/_jsx(WorkflowsSelect, {
            onChange: this.handleChange
          })
        })
      })
    });
  }
});