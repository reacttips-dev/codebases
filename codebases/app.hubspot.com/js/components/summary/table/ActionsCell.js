'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { connect } from 'react-redux';
import { tracker } from 'SequencesUI/util/UsageTracker';
import * as links from 'SequencesUI/lib/links';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import * as SummaryFilterTypes from 'SequencesUI/constants/SummaryFilterTypes';
import { getIsContactAlreadyEnrolled } from 'SequencesUI/selectors/enrollmentSelectors';
import * as SequenceEmailErrorTypes from 'SequencesUI/constants/SequenceEmailErrorTypes';
import * as UnenrolledSourceTypes from 'SequencesUI/constants/UnenrolledSourceTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
import * as SequenceStepDependencyTypes from 'SequencesUI/constants/SequenceStepDependencyTypes';
import { useUnenrollEnrollments } from 'SequencesUI/hooks/useUnenroll';
import { usePauseEnrollments } from 'SequencesUI/hooks/usePause';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UILink from 'UIComponents/link/UILink';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import SequenceReenrollModal from 'SequencesUI/components/summary/table/SequenceReenrollModal';
import EnrollmentEditModal from 'SequencesUI/components/outbox/EnrollmentEditModal';
import EnrollmentViewModal from 'SequencesUI/components/outbox/EnrollmentViewModal';
import { canUseEnrollments, isUngatedForReadOnlyView } from 'SequencesUI/lib/permissions';
import EnrollmentResumeModal from 'SequencesUI/components/outbox/EnrollmentResumeModal';
import UserContainer from '../../../data/UserContainer';
import { canResumeEnrollment } from 'SequencesUI/util/summary/SelectionUtils';
import shouldDisableEnrollments from 'SequencesUI/util/shouldDisableEnrollments';
import { isConnectedAccountValid } from 'SequencesUI/selectors/connectedAccountSelectors';
import BulkPauseConfirmation from '../../summarySearch/BulkPauseConfirmation';
import BulkUnenrollConfirmation from '../../summarySearch/BulkUnenrollConfirmation';

var trackUsageEvent = function trackUsageEvent(action) {
  tracker.track('sequencesUsage', {
    action: action,
    subscreen: 'sequence-summary'
  });
};

var trackInteractionEvent = function trackInteractionEvent(action) {
  tracker.track('sequencesInteraction', {
    action: action,
    subscreen: 'sequence-summary'
  });
};

var ActionsCell = function ActionsCell(_ref) {
  var _ref$contactAlreadyEn = _ref.contactAlreadyEnrolled,
      contactAlreadyEnrolled = _ref$contactAlreadyEn === void 0 ? false : _ref$contactAlreadyEn,
      disableEnrollments = _ref.disableEnrollments,
      enrollment = _ref.enrollment,
      fetchEnrollment = _ref.fetchEnrollment,
      inboxConnected = _ref.inboxConnected,
      sequenceEnrollments = _ref.sequenceEnrollments,
      startPolling = _ref.startPolling,
      contactName = _ref.contactName,
      query = _ref.query,
      deselectAllEnrollments = _ref.deselectAllEnrollments;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showEditModal = _useState2[0],
      setShowEditModal = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      showViewModal = _useState4[0],
      setShowViewModal = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      showPauseConfirmation = _useState6[0],
      setShowPauseConfirmation = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      showReenrollModal = _useState8[0],
      setShowReenrollModal = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      showResumeModal = _useState10[0],
      setShowResumeModal = _useState10[1];

  var _useState11 = useState(false),
      _useState12 = _slicedToArray(_useState11, 2),
      showUnenrollConfirmation = _useState12[0],
      setShowUnenrollConfirmation = _useState12[1];

  var _useUnenrollEnrollmen = useUnenrollEnrollments(query, List.of(enrollment)),
      _useUnenrollEnrollmen2 = _slicedToArray(_useUnenrollEnrollmen, 1),
      unenroll = _useUnenrollEnrollmen2[0];

  var _usePauseEnrollments = usePauseEnrollments(query, List.of(enrollment)),
      _usePauseEnrollments2 = _slicedToArray(_usePauseEnrollments, 1),
      pause = _usePauseEnrollments2[0];

  var enrollmentState = getPropertyValue(enrollment, 'hs_enrollment_state');
  useEffect(function () {
    var vid = +getPropertyValue(enrollment, 'hs_contact_id');

    if (vid && !sequenceEnrollments.get(vid)) {
      fetchEnrollment(vid);
    }
  }, [fetchEnrollment, enrollment, sequenceEnrollments]);

  var getShouldShowReenroll = function getShouldShowReenroll() {
    if (!contactName) {
      return false;
    }

    var unacceptableErrorTypes = ImmutableSet([SequenceEmailErrorTypes.UNSUBSCRIBED, SequenceEmailErrorTypes.BOUNCED]);

    var acceptableError = function acceptableError(error) {
      return !unacceptableErrorTypes.has(error);
    };

    if (enrollmentState === SummaryFilterTypes.UNENROLLED) {
      var source = getPropertyValue(enrollment, 'hs_unenrolled_source');

      if (source === UnenrolledSourceTypes.MANUAL || source === UnenrolledSourceTypes.WORKFLOW) {
        return true;
      }

      if (source === UnenrolledSourceTypes.ERROR) {
        var stepError = getPropertyValue(enrollment, 'hs_step_error_type') || SequenceEmailErrorTypes.UNKNOWN;
        return acceptableError(stepError);
      }
    }

    return false;
  };

  var handleEdit = useCallback(function () {
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.enrollmentEdited"
      }),
      type: 'success'
    });
    setShowEditModal(false);
  }, []);
  var handleUnenroll = useCallback(function () {
    unenroll(contactName);
    trackUsageEvent('Clicked unenroll');
    setShowUnenrollConfirmation(false);
    deselectAllEnrollments();
  }, [deselectAllEnrollments, contactName, unenroll]);

  var renderGoToTask = function renderGoToTask() {
    if (enrollmentState !== SummaryFilterTypes.PAUSED || getPropertyValue(enrollment, 'hs_dependency_type') !== SequenceStepDependencyTypes.TASK_COMPLETION) {
      return null;
    }

    var engagementId = getPropertyValue(enrollment, 'hs_paused_engagement_id');
    var ownerId = getPropertyValue(enrollment, 'hs_paused_owner_id');
    return /*#__PURE__*/_jsx(UILink, {
      external: true,
      href: links.task(engagementId, ownerId),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.actionsCell.goToTask"
      })
    }, "go-to-task-action");
  };

  var renderUnenroll = function renderUnenroll() {
    if (enrollmentState !== SummaryFilterTypes.EXECUTING && enrollmentState !== SummaryFilterTypes.PAUSED) {
      return null;
    }

    return /*#__PURE__*/_jsx(UILink, {
      "data-selenium-test": "unenroll-link",
      onClick: function onClick() {
        return setShowUnenrollConfirmation(true);
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.actionsCell.unenroll"
      })
    }, "unenroll-action");
  };

  var renderView = function renderView() {
    if (!isUngatedForReadOnlyView()) {
      return null;
    }

    return /*#__PURE__*/_jsx(UITooltip, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.actionsCell.viewTooltipInternal"
      }),
      children: /*#__PURE__*/_jsx(UILink, {
        "data-test-id": "view-link",
        onClick: function onClick() {
          return setShowViewModal(true);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.actionsCell.view"
        })
      })
    }, "view-action");
  };

  var renderEdit = function renderEdit() {
    var ownedByOtherUser = getPropertyValue(enrollment, 'hs_enrolled_by') !== "" + UserContainer.get().user_id;

    if (enrollmentState === SummaryFilterTypes.EXECUTING || getPropertyValue(enrollment, 'hs_dependency_type') === SequenceStepDependencyTypes.TASK_COMPLETION) {
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !ownedByOtherUser,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.actionsCell.editDisabledForUser"
        }),
        children: /*#__PURE__*/_jsx(UILink, {
          "data-test-id": "edit-link",
          onClick: function onClick() {
            trackUsageEvent('Clicked edit on enrollment');
            setShowEditModal(true);
          },
          disabled: ownedByOtherUser,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "summary.actionsCell.edit"
          })
        })
      }, "edit-action");
    }

    return null;
  };

  var renderResume = function renderResume() {
    var ownedByOtherUser = getPropertyValue(enrollment, 'hs_enrolled_by') !== "" + UserContainer.get().user_id;

    if (canResumeEnrollment(enrollment)) {
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !ownedByOtherUser,
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.actionsCell.resumeDisabledForUser"
        }),
        children: /*#__PURE__*/_jsx(UILink, {
          "data-test-id": "edit-and-resume",
          disabled: ownedByOtherUser,
          onClick: function onClick() {
            trackUsageEvent('Clicked edit and resume on a paused enrollment');
            setShowResumeModal(true);
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "summary.actionsCell.editAndResume"
          })
        })
      }, "resume-action");
    }

    return null;
  };

  var renderPause = function renderPause() {
    if (enrollmentState !== SummaryFilterTypes.EXECUTING) {
      return null;
    }

    return /*#__PURE__*/_jsx(UILink, {
      onClick: function onClick() {
        trackUsageEvent('Clicked pause on enrollment');
        setShowPauseConfirmation(true);
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.actionsCell.pause"
      })
    }, "pause-action");
  };

  var renderReenroll = function renderReenroll() {
    if (!getShouldShowReenroll()) {
      return null;
    }

    var ownedByOtherUser = getPropertyValue(enrollment, 'hs_enrolled_by') !== "" + UserContainer.get().user_id;
    var disableReenrollButton = disableEnrollments || !inboxConnected || contactAlreadyEnrolled || ownedByOtherUser;
    var tooltipTitle = null;

    if (disableEnrollments) {
      tooltipTitle = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "summary.tooltip.enrollDisabled.disableEnrollments_jsx",
        options: {
          external: true,
          href: links.statusPage()
        },
        elements: {
          Link: UILink
        }
      });
    }

    if (ownedByOtherUser) {
      tooltipTitle = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.tooltip.enrollDisabled.enrolledByAnotherUser"
      });
    }

    if (!inboxConnected) {
      tooltipTitle = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "summary.tooltip.enrollDisabled.inboxDisconnected_jsx",
        options: {
          external: true,
          href: links.connectInbox()
        },
        elements: {
          Link: UILink
        }
      });
    }

    if (contactAlreadyEnrolled) {
      tooltipTitle = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.tooltip.enrollDisabled.alreadyEnrolled"
      });
    }

    return /*#__PURE__*/_jsx(UITooltip, {
      disabled: !disableReenrollButton,
      placement: "bottom left",
      title: tooltipTitle,
      children: /*#__PURE__*/_jsx(UILink, {
        "data-test-id": "reenroll-link",
        onClick: function onClick() {
          setShowReenrollModal(true);
          trackUsageEvent('Clicked reenroll');
          tracker.track('sequencesInteraction', {
            action: 'Opened sales modal',
            subscreen: 'sequence-summary'
          });
        },
        disabled: disableReenrollButton,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.actionsCell.reenroll"
        })
      })
    }, "reenroll-action");
  };

  var actions = canUseEnrollments() ? [renderGoToTask(), renderEdit(), renderPause(), renderResume(), renderUnenroll(), renderReenroll(), renderView()].filter(Boolean) : [renderGoToTask(), renderView()].filter(Boolean);

  if (actions.length === 0) {
    return /*#__PURE__*/_jsx("td", {});
  }

  return /*#__PURE__*/_jsxs("td", {
    children: [/*#__PURE__*/_jsx(UIDropdown, {
      buttonSize: "extra-small",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.actionsCell.actions"
      }),
      placement: "bottom left",
      onClick: function onClick() {
        return trackInteractionEvent('Clicked Action on a specific sequence row');
      },
      children: /*#__PURE__*/_jsx(UIList, {
        children: actions
      })
    }), showEditModal && /*#__PURE__*/_jsx(EnrollmentEditModal, {
      enrollment: enrollment,
      onConfirm: handleEdit,
      onReject: function onReject() {
        return setShowEditModal(false);
      }
    }), showViewModal && /*#__PURE__*/_jsx(EnrollmentViewModal, {
      enrollment: enrollment,
      onReject: function onReject() {
        return setShowViewModal(false);
      }
    }), showUnenrollConfirmation && /*#__PURE__*/_jsx(BulkUnenrollConfirmation, {
      onConfirm: handleUnenroll,
      onReject: function onReject() {
        return setShowUnenrollConfirmation(false);
      },
      selectedEnrollments: List.of(enrollment)
    }), showPauseConfirmation && /*#__PURE__*/_jsx(BulkPauseConfirmation, {
      onCancel: function onCancel() {
        return setShowPauseConfirmation(false);
      },
      onConfirm: function onConfirm() {
        pause(contactName);
        setShowPauseConfirmation(false);
        deselectAllEnrollments();
      },
      selectedEnrollments: List.of(enrollment)
    }), showReenrollModal && /*#__PURE__*/_jsx(SequenceReenrollModal, {
      enrollment: enrollment,
      onConfirm: function onConfirm() {
        return setShowReenrollModal(false);
      },
      onReject: function onReject() {
        return setShowReenrollModal(false);
      },
      startPolling: startPolling
    }), showResumeModal && /*#__PURE__*/_jsx(EnrollmentResumeModal, {
      enrollment: enrollment,
      onConfirm: function onConfirm() {
        return setShowResumeModal(false);
      },
      onReject: function onReject() {
        return setShowResumeModal(false);
      },
      startPolling: startPolling,
      contactName: contactName
    })]
  });
};

ActionsCell.propTypes = {
  contactAlreadyEnrolled: PropTypes.bool.isRequired,
  disableEnrollments: PropTypes.bool.isRequired,
  enrollment: PropTypes.object.isRequired,
  fetchEnrollment: PropTypes.func.isRequired,
  inboxConnected: PropTypes.bool.isRequired,
  sequenceEnrollments: PropTypes.instanceOf(ImmutableMap),
  startPolling: PropTypes.func.isRequired,
  contactName: PropTypes.string,
  query: PropTypes.object.isRequired,
  deselectAllEnrollments: PropTypes.func.isRequired
};
export default connect(function (state, _ref2) {
  var enrollment = _ref2.enrollment;
  return {
    contactAlreadyEnrolled: getIsContactAlreadyEnrolled(state, {
      enrollment: enrollment
    }),
    disableEnrollments: shouldDisableEnrollments(state.enrollHealthStatus),
    sequenceEnrollments: state.sequenceEnrollments,
    inboxConnected: isConnectedAccountValid(state)
  };
}, {
  fetchEnrollment: SequenceActions.fetchEnrollment
})(ActionsCell);