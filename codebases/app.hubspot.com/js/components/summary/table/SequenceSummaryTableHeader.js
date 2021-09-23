'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import Small from 'UIComponents/elements/Small';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIList from 'UIComponents/list/UIList';
import UITableActionsRow from 'UIComponents/table/UITableActionsRow';
import { areAllEnrollmentsSelected, EnrollmentSelectionPropType } from '../../../util/enrollmentSelection';
import useBulkPause from '../../../hooks/useBulkPause';
import useBulkResume from '../../../hooks/useBulkResume';
import useBulkUnenroll from '../../../hooks/useBulkUnenroll';
import { tracker } from '../../../util/UsageTracker';

var SequenceSummaryTableHeader = function SequenceSummaryTableHeader(_ref) {
  var children = _ref.children,
      contacts = _ref.contacts,
      enrollmentSelection = _ref.enrollmentSelection,
      pageEnrollments = _ref.pageEnrollments,
      query = _ref.query,
      startPolling = _ref.startPolling;

  var _useBulkPause = useBulkPause(enrollmentSelection, query, contacts, startPolling),
      _useBulkPause2 = _slicedToArray(_useBulkPause, 2),
      bulkPauseButton = _useBulkPause2[0],
      bulkPauseConfirmationModal = _useBulkPause2[1];

  var _useBulkResume = useBulkResume(enrollmentSelection, query, contacts, startPolling),
      _useBulkResume2 = _slicedToArray(_useBulkResume, 2),
      bulkResumeButton = _useBulkResume2[0],
      bulkResumeConfirmationModal = _useBulkResume2[1];

  var _useBulkUnenroll = useBulkUnenroll(enrollmentSelection, query, contacts, startPolling),
      _useBulkUnenroll2 = _slicedToArray(_useBulkUnenroll, 2),
      bulkUnenrollButton = _useBulkUnenroll2[0],
      bulkUnenrollConfirmationModal = _useBulkUnenroll2[1];

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(UITableActionsRow, {
      actions: /*#__PURE__*/_jsxs(UIList, {
        childClassName: "m-right-4",
        inline: true,
        children: [/*#__PURE__*/_jsx(Small, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.enrollmentTable.headerActions.contactsSelected",
            options: {
              count: enrollmentSelection.selectedEnrollments.length
            }
          })
        }), bulkPauseButton, bulkResumeButton, bulkUnenrollButton]
      }),
      open: enrollmentSelection.selectedEnrollments.length > 0,
      openAtColumnIndex: 1,
      children: [/*#__PURE__*/_jsx("th", {
        children: /*#__PURE__*/_jsx(UICheckbox, {
          "aria-label": I18n.text('summary.selectAllRows'),
          checked: areAllEnrollmentsSelected(pageEnrollments, enrollmentSelection),
          disabled: !pageEnrollments,
          indeterminate: enrollmentSelection.selectedEnrollments.length > 0,
          onChange: function onChange() {
            if (enrollmentSelection.selectedEnrollments.length) {
              enrollmentSelection.deselectAllEnrollments();
            } else {
              tracker.track('sequencesInteraction', {
                action: 'Click bulk select',
                subscreen: 'sequence-summary'
              });
              enrollmentSelection.selectEnrollments(pageEnrollments);
            }
          }
        })
      }), children]
    }), bulkPauseConfirmationModal, bulkResumeConfirmationModal, bulkUnenrollConfirmationModal]
  });
};

SequenceSummaryTableHeader.propTypes = {
  children: PropTypes.node,
  contacts: PropTypes.object.isRequired,
  enrollmentSelection: EnrollmentSelectionPropType.isRequired,
  pageEnrollments: PropTypes.array.isRequired,
  query: PropTypes.object.isRequired,
  startPolling: PropTypes.func.isRequired
};
export default SequenceSummaryTableHeader;