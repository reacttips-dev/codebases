'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import UserStore from 'crm_data/user/UserStore';
import links from 'crm-legacy-links/links';
import BulkActionPropsType from '../../grid/utils/BulkActionPropsType';
import OwnersSearchableSelectInput from '../../input/OwnersSearchableSelectInput';
import { CrmLogger } from 'customer-data-tracking/loggers';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import { connect } from 'general-store';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import Small from 'UIComponents/elements/Small';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIMatchTextArea from 'UIComponents/input/UIMatchTextArea';
import UILink from 'UIComponents/link/UILink';
export var canSave = function canSave(countIsMatched, applyToAllIsChecked) {
  if (applyToAllIsChecked === undefined) {
    return countIsMatched;
  }

  if (countIsMatched !== true || applyToAllIsChecked !== true) {
    return false;
  }

  return true;
};
var BulkAssignToDialog = createReactClass({
  displayName: 'BulkAssignToDialog',
  propTypes: Object.assign({
    bulkActionProps: BulkActionPropsType.isRequired,
    userEmail: PropTypes.string.isRequired
  }, PromptablePropInterface),
  getInitialState: function getInitialState() {
    var isSelectionGreaterThanView = this.props.bulkActionProps && this.props.bulkActionProps.get('isSelectionGreaterThanView');
    return {
      value: '',
      countIsMatched: !isSelectionGreaterThanView,
      applyToAllIsChecked: isSelectionGreaterThanView ? !this.shouldRenderApplyToAll() : undefined
    };
  },
  handleChange: function handleChange(value) {
    return this.setState({
      value: value
    });
  },
  handleConfirm: function handleConfirm(e) {
    e.preventDefault();
    var userEmail = this.props.userEmail;
    this.props.onConfirm({
      selectedOwner: this.state.value,
      applyToAll: this.state.applyToAllIsChecked,
      email: userEmail
    });
    CrmLogger.log('bulkAssign');
  },
  handleReject: function handleReject() {
    var _this$props = this.props,
        bulkActionProps = _this$props.bulkActionProps,
        onReject = _this$props.onReject;
    var objectType = bulkActionProps.objectType;
    CrmLogger.log('indexInteractions', {
      action: 'cancel bulk assign',
      type: objectType
    });
    return onReject();
  },
  handleInviteClick: function handleInviteClick() {
    var bulkActionProps = this.props.bulkActionProps;
    var objectType = bulkActionProps.objectType;
    CrmLogger.logIndexInteraction(objectType, {
      action: 'assign-modal-invite-link'
    });
    return setTimeout(this.redirectToSettings, 200);
  },
  redirectToSettings: function redirectToSettings() {
    return window.location = links.team('?createUserEmail');
  },
  shouldRenderApplyToAll: function shouldRenderApplyToAll() {
    var _this$props$bulkActio = this.props.bulkActionProps,
        isSelectionGreaterThanView = _this$props$bulkActio.isSelectionGreaterThanView,
        isFilterApplied = _this$props$bulkActio.isFilterApplied;

    if (!isSelectionGreaterThanView || isFilterApplied) {
      return false;
    }

    return true;
  },
  renderInvite: function renderInvite() {
    return /*#__PURE__*/_jsx("p", {
      className: "m-top-4",
      "data-test": "render-invite",
      children: /*#__PURE__*/_jsxs(Small, {
        use: "help",
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "assignToModal.inviteMessage"
        }), /*#__PURE__*/_jsx(UILink, {
          className: "m-left-1",
          onClick: this.handleInviteClick,
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "assignToModal.inviteLink"
          })
        })]
      })
    });
  },
  renderApplyToAll: function renderApplyToAll() {
    var _this = this;

    var objectType = this.props.bulkActionProps.objectType;
    var applyToAllIsChecked = this.state.applyToAllIsChecked;
    return /*#__PURE__*/_jsx(UICheckbox, {
      checked: applyToAllIsChecked,
      onChange: function onChange(_ref) {
        var checked = _ref.target.checked;

        _this.setState({
          applyToAllIsChecked: checked
        });
      },
      className: "m-top-2",
      "data-test": "render-apply-to-all",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "topbarContents.bulkEditModal.confirmApplyToAll." + objectType
      })
    });
  },
  renderMatch: function renderMatch() {
    var _this2 = this;

    var _this$props$bulkActio2 = this.props.bulkActionProps,
        isSelectionGreaterThanView = _this$props$bulkActio2.isSelectionGreaterThanView,
        selectionCount = _this$props$bulkActio2.selectionCount,
        objectTypeLabel = _this$props$bulkActio2.objectTypeLabel;

    if (!isSelectionGreaterThanView) {
      return null;
    }

    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        className: "m-y-4",
        label: I18n.text('topbarContents.bulkEditModal.confirmLabel'),
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "topbarContents.bulkEditModal.boldMove",
          options: {
            count: selectionCount,
            type: objectTypeLabel
          }
        })
      }), /*#__PURE__*/_jsx(UIMatchTextArea, {
        match: "" + selectionCount,
        onMatchedChange: function onMatchedChange(_ref2) {
          var value = _ref2.target.value;
          return _this2.setState({
            countIsMatched: value
          });
        }
      })]
    });
  },
  render: function render() {
    var objectType = this.props.bulkActionProps.objectType;
    return /*#__PURE__*/_jsxs(BaseDialog, {
      title: I18n.text('assignToModal.title', {
        objectType: I18n.text("genericTypes." + objectType)
      }),
      confirmLabel: I18n.text('assignToModal.buttonText'),
      confirmDisabled: !canSave(this.state.countIsMatched, this.state.applyToAllIsChecked),
      onConfirm: this.handleConfirm,
      onReject: this.handleReject,
      children: [/*#__PURE__*/_jsxs("form", {
        onSubmit: this.handleConfirm,
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          label: I18n.text('assignToModal.message'),
          children: /*#__PURE__*/_jsx(OwnersSearchableSelectInput, {
            provideNoneOption: true,
            className: "assign-to-dialog-dropdown",
            onChange: this.handleChange,
            value: this.state.value
          })
        }), this.renderMatch(), this.shouldRenderApplyToAll() && this.renderApplyToAll()]
      }), this.renderInvite()]
    });
  }
});
var deps = {
  userEmail: {
    stores: [UserStore],
    deref: function deref() {
      return UserStore.get('email');
    }
  }
};
export default connect(deps)(BulkAssignToDialog);