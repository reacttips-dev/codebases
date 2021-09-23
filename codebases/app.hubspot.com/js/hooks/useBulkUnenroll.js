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
import { canUnenrollEnrollment } from 'SequencesUI/util/summary/SelectionUtils';
import { maybeGetContactName } from 'SequencesUI/util/summary/CRMSearchUtils';
import { useUnenrollEnrollments } from './useUnenroll';
import BulkUnenrollConfirmation from '../components/summarySearch/BulkUnenrollConfirmation';
import UITooltip from 'UIComponents/tooltip/UITooltip';
export default function useBulkUnenroll(enrollmentSelection, query, contacts, startPolling) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showConfirmation = _useState2[0],
      setShowConfirmation = _useState2[1];

  var selectedEnrollmentsForUnenroll = enrollmentSelection.selectedEnrollments.filter(canUnenrollEnrollment);

  var _useUnenrollEnrollmen = useUnenrollEnrollments(query, List(selectedEnrollmentsForUnenroll)),
      _useUnenrollEnrollmen2 = _slicedToArray(_useUnenrollEnrollmen, 1),
      unenrollEnrollments = _useUnenrollEnrollmen2[0];

  var onConfirm = useCallback(function () {
    if (enrollmentSelection.selectedAllMatches) {
      SequenceEnrollmentTableActions.unenrollQuery(query).then(function (targetedEnrollmentIds) {
        setShowConfirmation(false);
        startPolling(targetedEnrollmentIds.map(function (i) {
          return "" + i;
        }));
      });
    } else {
      unenrollEnrollments(maybeGetContactName(selectedEnrollmentsForUnenroll, contacts));
      setShowConfirmation(false);
      enrollmentSelection.deselectAllEnrollments();
    }
  }, [contacts, enrollmentSelection, query, selectedEnrollmentsForUnenroll, startPolling, unenrollEnrollments]);
  var unenrollDisabled = !selectedEnrollmentsForUnenroll.length && !enrollmentSelection.selectedAllMatches;

  var bulkUnenrollButton = /*#__PURE__*/_jsx(UITooltip, {
    disabled: !unenrollDisabled,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.enrollmentTable.headerActions.unenrollDisabled"
    }),
    children: /*#__PURE__*/_jsxs(UILink, {
      "data-test-id": "bulk-unenroll-button",
      disabled: unenrollDisabled,
      onClick: function onClick() {
        return setShowConfirmation(true);
      },
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "block"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.enrollmentTable.headerActions.unenroll"
      })]
    })
  });

  var bulkUnenrollConfirmationModal = showConfirmation ? /*#__PURE__*/_jsx(BulkUnenrollConfirmation, {
    onConfirm: onConfirm,
    onReject: function onReject() {
      return setShowConfirmation(false);
    },
    selectedAllMatches: enrollmentSelection.selectedAllMatches,
    selectedEnrollments: List(selectedEnrollmentsForUnenroll)
  }) : null;
  return [bulkUnenrollButton, bulkUnenrollConfirmationModal];
}