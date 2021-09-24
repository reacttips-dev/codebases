'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import UIButton from 'UIComponents/button/UIButton';
import H2 from 'UIComponents/elements/headings/H2';
import { sequenceNameIsValid } from 'SequencesUI/util/validateSequence';
import { getCurrentUserView } from 'SequencesUI/util/convertToSearchResult';
import { getOwnerName } from 'SequencesUI/util/owner';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
var ENTER = 13;
export default createReactClass({
  displayName: "EditNameModal",
  propTypes: {
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    open: PropTypes.bool,
    sequence: PropTypes.instanceOf(ImmutableMap).isRequired
  },
  getInitialState: function getInitialState() {
    var sequence = this.props.sequence;
    var name = sequence.get('name');
    return {
      name: name !== I18n.text('edit.editNameModal.newSequence') ? name : ''
    };
  },
  handleEditName: function handleEditName(e) {
    this.setState({
      name: e.target.value
    });
  },
  handleClose: function handleClose() {
    var onConfirm = this.props.onConfirm;
    var name = this.state.name;
    onConfirm(name);
  },
  handleKeyPress: function handleKeyPress(e) {
    var _this$validateName = this.validateName(),
        nameIsInvalid = _this$validateName.nameIsInvalid;

    if (e.which === ENTER && !nameIsInvalid) {
      this.handleClose(e);
    }
  },
  validateName: function validateName() {
    var name = this.state.name;
    var validName = sequenceNameIsValid(name);
    var validationMessage = validName || name.trim() === '' ? null : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "edit.editName.error.nameTooLong"
    });
    return {
      nameIsInvalid: !validName,
      validationMessage: validationMessage
    };
  },
  renderOwner: function renderOwner() {
    var user = getCurrentUserView();
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      className: "m-right-4",
      message: "edit.owner",
      options: {
        owner: getOwnerName(user)
      }
    });
  },
  render: function render() {
    var _this$props = this.props,
        onReject = _this$props.onReject,
        open = _this$props.open;
    var name = this.state.name;

    var _this$validateName2 = this.validateName(),
        nameIsInvalid = _this$validateName2.nameIsInvalid,
        validationMessage = _this$validateName2.validationMessage;

    return /*#__PURE__*/_jsxs(UIModal, {
      className: "edit-name-modal",
      use: "conversational",
      open: open,
      width: "auto",
      children: [/*#__PURE__*/_jsx(UIDialogHeader, {
        children: /*#__PURE__*/_jsx(H2, {
          className: "m-top-4 is--heading-4",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.editNameModal.title"
          })
        })
      }), /*#__PURE__*/_jsxs(UIDialogBody, {
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          error: nameIsInvalid,
          validationMessage: validationMessage,
          children: /*#__PURE__*/_jsx(UITextInput, {
            autoFocus: true,
            value: name,
            placeholder: I18n.text('edit.editNameModal.placeholder'),
            onChange: this.handleEditName,
            onKeyPress: this.handleKeyPress
          })
        }), /*#__PURE__*/_jsx(UIFlex, {
          className: "m-top-8",
          align: "start",
          children: this.renderOwner()
        })]
      }), /*#__PURE__*/_jsxs(UIDialogFooter, {
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          disabled: nameIsInvalid,
          onClick: this.handleClose,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.editNameModal.save"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          use: "tertiary-light",
          onClick: onReject,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.editNameModal.cancel"
          })
        })]
      })]
    });
  }
});