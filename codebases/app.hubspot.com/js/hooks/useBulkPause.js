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
import BulkPauseConfirmation from 'SequencesUI/components/summarySearch/BulkPauseConfirmation';
import { canPauseEnrollment } from 'SequencesUI/util/summary/SelectionUtils';
import { maybeGetContactName } from 'SequencesUI/util/summary/CRMSearchUtils';
import { usePauseEnrollments } from 'SequencesUI/hooks/usePause';
import UITooltip from 'UIComponents/tooltip/UITooltip';
export default function useBulkPause(enrollmentSelection, query, contacts, startPolling) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showConfirmation = _useState2[0],
      setShowConfirmation = _useState2[1];

  var selectedEnrollmentsForPause = enrollmentSelection.selectedEnrollments.filter(canPauseEnrollment);

  var _usePauseEnrollments = usePauseEnrollments(query, List(selectedEnrollmentsForPause)),
      _usePauseEnrollments2 = _slicedToArray(_usePauseEnrollments, 1),
      pauseEnrollments = _usePauseEnrollments2[0];

  var onConfirm = useCallback(function () {
    if (enrollmentSelection.selectedAllMatches) {
      SequenceEnrollmentTableActions.pauseQuery(query).then(function (targetedEnrollmentIds) {
        setShowConfirmation(false);
        startPolling(targetedEnrollmentIds.map(function (i) {
          return "" + i;
        }));
      });
    } else {
      pauseEnrollments(maybeGetContactName(selectedEnrollmentsForPause, contacts));
      setShowConfirmation(false);
      enrollmentSelection.deselectAllEnrollments();
    }
  }, [contacts, enrollmentSelection, pauseEnrollments, query, selectedEnrollmentsForPause, startPolling]);
  var pauseDisabled = !selectedEnrollmentsForPause.length && !enrollmentSelection.selectedAllMatches;

  var bulkPauseButton = /*#__PURE__*/_jsx(UITooltip, {
    disabled: !pauseDisabled,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.headerActions.pauseDisabled"
    }),
    children: /*#__PURE__*/_jsxs(UILink, {
      "data-test-id": "bulk-pause-button",
      disabled: pauseDisabled,
      onClick: function onClick() {
        return setShowConfirmation(true);
      },
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "playerPause"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.enrollmentTable.headerActions.pause"
      })]
    })
  });

  var bulkPauseConfirmationModal = showConfirmation ? /*#__PURE__*/_jsx(BulkPauseConfirmation, {
    onCancel: function onCancel() {
      return setShowConfirmation(false);
    },
    onConfirm: onConfirm,
    selectedAllMatches: enrollmentSelection.selectedAllMatches,
    selectedEnrollments: List(selectedEnrollmentsForPause)
  }) : null;
  return [bulkPauseButton, bulkPauseConfirmationModal];
}