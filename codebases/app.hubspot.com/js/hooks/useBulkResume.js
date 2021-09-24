'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { List } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import * as SequenceEnrollmentTableActions from 'SequencesUI/actions/SequenceEnrollmentTableActions';
import { canResumeEnrollment } from 'SequencesUI/util/summary/SelectionUtils';
import { getPropertyValue, maybeGetContactName } from 'SequencesUI/util/summary/CRMSearchUtils';
import BulkResumeConfirmation from '../components/summarySearch/BulkResumeConfirmation';
import UITooltip from 'UIComponents/tooltip/UITooltip';
export default function useBulkResume(enrollmentSelection, query, contacts, startPolling) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showConfirmation = _useState2[0],
      setShowConfirmation = _useState2[1];

  var selectedEnrollmentsForResume = enrollmentSelection.selectedEnrollments.filter(canResumeEnrollment);
  var onConfirm = useCallback(function () {
    if (enrollmentSelection.selectedAllMatches) {
      SequenceEnrollmentTableActions.resumeQuery(query).then(function (targetedEnrollmentIds) {
        setShowConfirmation(false);
        startPolling(targetedEnrollmentIds.map(function (i) {
          return "" + i;
        }));
      });
    } else {
      SequenceEnrollmentTableActions.resume(selectedEnrollmentsForResume, maybeGetContactName(selectedEnrollmentsForResume, contacts)).then(function () {
        setShowConfirmation(false);
        startPolling(selectedEnrollmentsForResume.map(function (enrollment) {
          return getPropertyValue(enrollment, 'hs_enrollment_id');
        }));
      });
    }
  }, [contacts, enrollmentSelection, query, selectedEnrollmentsForResume, setShowConfirmation, startPolling]);
  var resumeDisabled = !selectedEnrollmentsForResume.length && !enrollmentSelection.selectedAllMatches;

  var bulkResumeButton = /*#__PURE__*/_jsx(UITooltip, {
    disabled: !resumeDisabled,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.headerActions.resumeDisabled"
    }),
    children: /*#__PURE__*/_jsxs(UILink, {
      "data-test-id": "bulk-resume-button",
      disabled: resumeDisabled,
      onClick: function onClick() {
        return setShowConfirmation(true);
      },
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "playerPlay"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.enrollmentTable.headerActions.resume"
      })]
    })
  });

  var bulkResumeConfirmationModal = showConfirmation ? /*#__PURE__*/_jsx(BulkResumeConfirmation, {
    onCancel: function onCancel() {
      return setShowConfirmation(false);
    },
    onConfirm: onConfirm,
    selectedAllMatches: enrollmentSelection.selectedAllMatches,
    selectedEnrollments: List(selectedEnrollmentsForResume)
  }) : null;
  return [bulkResumeButton, bulkResumeConfirmationModal];
}