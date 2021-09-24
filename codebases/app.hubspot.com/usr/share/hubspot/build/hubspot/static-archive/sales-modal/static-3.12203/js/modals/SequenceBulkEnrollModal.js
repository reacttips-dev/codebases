'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as ContentApi from 'sales-modal/api/ContentApi';
import * as SalesModalSearchContentTypes from 'sales-modal/constants/SalesModalSearchContentTypes';
import UIModal from 'UIComponents/dialog/UIModal';
import UIModalDialog from 'UIComponents/dialog/UIModalDialog';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import H2 from 'UIComponents/elements/headings/H2';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import SalesModalAlertsStore from 'sales-modal/utils/SalesModalAlertsStore';
import SequenceBulkEnrollContainer from '../containers/SequenceBulkEnrollContainer';
import SalesModalContainer from '../containers/SalesModalContainer';
import FireAlarm from '../FireAlarm';
import { TEMPLATES_SEQUENCES_APPNAME } from '../constants/FireAlarmAppNames';
export default createReactClass({
  displayName: "SequenceBulkEnrollModal",
  propTypes: {
    contacts: PropTypes.instanceOf(List),
    sequenceId: PropTypes.number,
    closeModal: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    enrollMultipleContacts: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      sequenceId: this.props.sequenceId || null
    };
  },
  selectSequence: function selectSequence(_ref) {
    var contentId = _ref.contentId;
    ContentApi.updateUsage({
      contentId: contentId,
      contentType: SalesModalSearchContentTypes.SEQUENCES
    });
    this.setState({
      sequenceId: contentId
    });
  },
  render: function render() {
    var sequenceId = this.state.sequenceId;
    var _this$props = this.props,
        contacts = _this$props.contacts,
        onConfirm = _this$props.onConfirm,
        closeModal = _this$props.closeModal,
        enrollMultipleContacts = _this$props.enrollMultipleContacts;

    if (!sequenceId) {
      return /*#__PURE__*/_jsxs(UIModalDialog, {
        "data-selenium-test": "sequence-bulk-enroll-sequence-selection-modal",
        size: "auto",
        onEsc: function onEsc() {
          return null;
        },
        width: 980,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: closeModal
          }), /*#__PURE__*/_jsx(H2, {
            "aria-level": 1,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "dialogHeader.sequences"
            })
          })]
        }), /*#__PURE__*/_jsx(UIDialogBody, {
          className: "p-bottom-0 p-top-3 p-x-0",
          children: /*#__PURE__*/_jsx(SalesModalContainer, Object.assign({}, this.props, {
            selectSequence: this.selectSequence,
            fixedHeight: true
          }))
        })]
      });
    }

    return /*#__PURE__*/_jsxs(UIModal, {
      "data-selenium-test": "sequence-bulk-enroll-modal",
      use: "fullscreen",
      children: [/*#__PURE__*/_jsx(UIDialogHeader, {
        className: "gradient-thunderdome-calypso",
        children: /*#__PURE__*/_jsx(H2, {
          "aria-level": 1,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "bulkEnroll.header.title"
          })
        })
      }), /*#__PURE__*/_jsx(FireAlarm, {
        appName: TEMPLATES_SEQUENCES_APPNAME
      }), /*#__PURE__*/_jsxs(UIDialogBody, {
        className: "p-x-0 p-bottom-1 p-top-0",
        children: [/*#__PURE__*/_jsx(UIFloatingAlertList, {
          alertStore: SalesModalAlertsStore,
          use: "contextual"
        }), /*#__PURE__*/_jsx(SequenceBulkEnrollContainer, {
          sequenceId: sequenceId,
          contacts: contacts,
          onConfirm: onConfirm,
          enrollMultipleContacts: enrollMultipleContacts
        })]
      })]
    });
  }
});