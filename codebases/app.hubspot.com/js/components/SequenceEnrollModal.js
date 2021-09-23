'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import UserContainer from 'SequencesUI/data/UserContainer';
import { SEQUENCESUI } from 'sales-modal/constants/Platform';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import PortalContainer from 'SequencesUI/data/PortalContainer';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import { SequenceEnrollmentRootDeprecated } from 'SequencesUI/components/async/AsyncSalesModal';
import { SequenceBulkEnrollModalRoot } from 'SequencesUI/components/async/AsyncSalesModal';

var SequenceEnrollModal = function SequenceEnrollModal(_ref) {
  var useMultipleContactSelection = _ref.useMultipleContactSelection,
      contacts = _ref.contacts,
      sequenceId = _ref.sequenceId,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      connectedAccounts = _ref.connectedAccounts,
      enroll = _ref.enroll,
      bulkEnroll = _ref.bulkEnroll;
  useEffect(function () {
    if (connectedAccounts) {
      tracker.track('pageView', {
        subscreen: 'enroll'
      });
    }
  }, [connectedAccounts]);

  if (!connectedAccounts) {
    return null;
  }

  if (!useMultipleContactSelection) {
    var contact = contacts.first();
    return /*#__PURE__*/_jsx(SequenceEnrollmentRootDeprecated, {
      user: fromJS(UserContainer.get()),
      portal: fromJS(PortalContainer.get()),
      platform: SEQUENCESUI,
      recipient: getProperty(contact, 'email'),
      closeModal: onReject,
      enrollSequence: onConfirm,
      selectConnectedAccount: true,
      sequenceId: sequenceId,
      enrollType: EnrollTypes.SINGLE_ENROLL
    });
  }

  return /*#__PURE__*/_jsx(SequenceBulkEnrollModalRoot, {
    user: fromJS(UserContainer.get()),
    portal: fromJS(PortalContainer.get()),
    platform: SEQUENCESUI,
    closeModal: onReject,
    enrollSequence: enroll,
    enrollAllInSequence: bulkEnroll,
    selectConnectedAccount: true,
    sequenceId: sequenceId,
    contacts: contacts.map(function (contact) {
      return contact.get('vid');
    }).toList(),
    confirmBulkEnroll: onConfirm
  });
};

SequenceEnrollModal.proptypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  sequenceId: PropTypes.number.isRequired,
  useMultipleContactSelection: PropTypes.bool.isRequired,
  contacts: PropTypes.instanceOf(ImmutableMap),
  connectedAccounts: PropTypes.object,
  enroll: PropTypes.func.isRequired,
  bulkEnroll: PropTypes.func.isRequired
};
export default connect(null, {
  enroll: SequenceActions.enroll,
  bulkEnroll: SequenceActions.bulkEnroll
})(SequenceEnrollModal);