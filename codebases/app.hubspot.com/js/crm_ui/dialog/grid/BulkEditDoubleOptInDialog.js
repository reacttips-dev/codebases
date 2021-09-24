'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import BulkActionPropsType from '../../grid/utils/BulkActionPropsType';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import createReactClass from 'create-react-class';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UIForm from 'UIComponents/form/UIForm';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
var options = {
  yes: 'yes',
  no: 'no'
};
var BulkEditDoubleOptInDialog = createReactClass({
  displayName: "BulkEditDoubleOptInDialog",
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
    var bulkActionProps = this.props.bulkActionProps;
    var allSelected = bulkActionProps.get('allSelected');
    var searchQuery = bulkActionProps.get('query');
    var checked = bulkActionProps.get('checked');
    var objectCount = bulkActionProps.get('selectionCount');
    var criteria = allSelected ? {
      contactsSearch: searchQuery
    } : {
      vids: checked.toArray()
    };
    this.props.onConfirm({
      isDoubleOptedIn: this.state.value === options.yes,
      criteria: criteria,
      objectCount: objectCount
    });
  },
  render: function render() {
    var bulkActionProps = this.props.bulkActionProps;
    var objectCount = bulkActionProps.get('selectionCount');
    var value = this.state.value;
    return /*#__PURE__*/_jsx(BaseDialog, {
      title: I18n.text('bulkEditDoubleOptInDialog.title', {
        count: objectCount
      }),
      confirmLabel: I18n.text('bulkEditDoubleOptInDialog.buttonText'),
      confirmDisabled: value == null,
      onConfirm: this.handleConfirm,
      onReject: this.props.onReject,
      width: 550,
      children: /*#__PURE__*/_jsxs(UIForm, {
        onSubmit: this.handleConfirm,
        children: [/*#__PURE__*/_jsx(UIRadioInput, {
          checked: value === options.no,
          "data-selenium-test": "opt-in-dialog-nay",
          value: options.no,
          name: "doi-status",
          onChange: this.handleChange,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "bulkEditDoubleOptInDialog.options.nay"
          })
        }), /*#__PURE__*/_jsx(UIRadioInput, {
          checked: value === options.yes,
          "data-selenium-test": "opt-in-dialog-yea",
          value: options.yes,
          name: "doi-status",
          onChange: this.handleChange,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "bulkEditDoubleOptInDialog.options.yea"
          })
        })]
      })
    });
  }
});
export default BulkEditDoubleOptInDialog;