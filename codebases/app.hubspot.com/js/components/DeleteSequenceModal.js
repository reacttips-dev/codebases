'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Map as ImmutableMap, List } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIList from 'UIComponents/list/UIList';
import NotOwnedWarning from './NotOwnedWarning';
import { DELETE } from 'SequencesUI/constants/NotOwnedWarningTypes';

var DeleteSequenceModal = function DeleteSequenceModal(_ref) {
  var numberOfContactsInSequence = _ref.numberOfContactsInSequence,
      searchResults = _ref.searchResults,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject;
  var sequenceName = searchResults.first().get('name');
  var count = searchResults.size;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.deleteSequenceModal.confirm"
    }),
    confirmUse: "danger",
    description: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(NotOwnedWarning, {
        type: DELETE,
        count: count,
        searchResults: searchResults
      }), /*#__PURE__*/_jsxs(UIList, {
        styled: true,
        className: "p-left-4",
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          className: "delete-sequence-modal",
          message: "index.deleteSequenceModal.description.numContacts",
          options: {
            count: numberOfContactsInSequence
          }
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.deleteSequenceModal.description.email"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.deleteSequenceModal.description.task"
        })]
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.deleteSequenceModal.description.cannotBeUndone"
      })]
    }),
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.deleteSequenceModal.cancel"
    }),
    match: I18n.text('index.deleteSequenceModal.matcher'),
    matcherLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.deleteSequenceModal.matcherLabel"
    }),
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.deleteSequenceModal.delete",
      options: {
        count: count,
        sequenceName: sequenceName
      }
    }),
    onConfirm: onConfirm,
    onReject: onReject,
    use: "danger"
  });
};

DeleteSequenceModal.propTypes = {
  numberOfContactsInSequence: PropTypes.number.isRequired,
  searchResults: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.instanceOf(List)]).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default DeleteSequenceModal;