'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toArray from "@babel/runtime/helpers/esm/toArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import Raven from 'Raven';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import unescapedText from 'I18n/utils/unescapedText';
import * as links from 'SequencesUI/lib/links';
import IndexUIActions from 'SalesContentIndexUI/data/actions/IndexUIActions';
import { convertSequenceToSearchResult } from 'SequencesUI/util/convertToSearchResult';
import UILink from 'UIComponents/link/UILink';
import * as SequenceApi from '../api/SequenceApi';
import * as CRMSearchApi from 'SequencesUI/api/CRMSearchApi';
import * as SummaryApi from 'SequencesUI/api/SummaryApi';
import * as TemplateApi from 'SequencesUI/api/TemplateApi';
import * as SequenceActionTypes from 'SequencesUI/constants/SequenceActionTypes';
import * as EnrollErrorTypes from 'SequencesUI/constants/EnrollErrorTypes';
import * as TemplateActions from './TemplateActions';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { trackSingleEnrollSuccess, trackSingleEnrollError } from 'sales-modal/lib/CustomPageActions';
import { SEQUENCESUI } from 'sales-modal/constants/Platform';
import { getUserId } from 'SequencesUI/lib/permissions';
import { enrollmentPollingResolved } from './SequenceEnrollmentTableActions'; // When we pause or resume all enrollments from outside the table, we clear
// the IDs after a set time if the table hasn't already refreshed them for us.

var BULK_ACTION_RESOLVE_TIMEOUT_SECONDS = 30;
var sequenceFetchSucceeded = createAction(SequenceActionTypes.SEQUENCE_FETCH_SUCCEEDED, identity);
var sequenceFetchFailed = createAction(SequenceActionTypes.SEQUENCE_FETCH_FAILED, identity);
var sequenceEnrollSucceeded = createAction(SequenceActionTypes.ENROLL_SUCCESS, identity);
export var bulkEnrollSucceeded = createAction(SequenceActionTypes.BULK_ENROLL_SUCCESS, identity);
var enrollmentFetchSucceeded = createAction(SequenceActionTypes.ENROLLMENT_FETCH_SUCCESS, identity);
var summaryCountFetchSucceeded = createAction(SequenceActionTypes.SUMMARY_COUNT_FETCH_SUCCEEDED, identity);
var summaryCountFetchStarted = createAction(SequenceActionTypes.SUMMARY_COUNT_FETCH_STARTED, identity);
var pastEnrollmentFetchSucceeded = createAction(SequenceActionTypes.PAST_ENROLLMENT_FETCH_SUCCEEDED, identity);
export var sequencesUsageFetchSucceeded = createAction(SequenceActionTypes.SEQUENCE_FETCH_USAGE_SUCCESS, identity);
export var updateName = createAction(SequenceActionTypes.SEQUENCE_UPDATE_NAME, identity);

var getEnrollAlertMessage = function getEnrollAlertMessage(isReenroll) {
  if (isReenroll) {
    return {
      successTitle: 'alerts.sequenceReenrolledMessage',
      failureTitle: 'alerts.sequenceNotReenrolled',
      failureMessage: 'alerts.sequenceNotReenrolledMessage'
    };
  }

  return {
    successTitle: 'alerts.sequenceEnrolledMessage',
    failureTitle: 'alerts.sequenceNotEnrolled',
    failureMessage: 'alerts.sequenceNotEnrolledMessage'
  };
};

export var fetchSequence = function fetchSequence(id) {
  return function (dispatch) {
    var sequenceId = parseInt(id, 10);
    return SequenceApi.fetch(sequenceId).then(function (res) {
      dispatch(sequenceFetchSucceeded({
        sequenceId: sequenceId,
        sequence: res
      }));
      return res;
    }, function (err) {
      dispatch(sequenceFetchFailed({
        sequenceId: sequenceId,
        error: err
      }));
      throw err;
    });
  };
};
export var save = function save(_ref) {
  var sequence = _ref.sequence,
      _ref$showErrorAlert = _ref.showErrorAlert,
      showErrorAlert = _ref$showErrorAlert === void 0 ? false : _ref$showErrorAlert;

  if (sequence.has('id')) {
    return SequenceApi.update(sequence.get('id'), sequence.toJS()).then(function (res) {
      IndexUIActions.updateResult(convertSequenceToSearchResult(res));
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.sequenceUpdated"
        }),
        type: 'success'
      });
      return res;
    }, function (err) {
      if (showErrorAlert) {
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "alerts.sequenceSaveErrorTitle"
          }),
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "alerts.sequenceSaveErrorMessage"
          }),
          type: 'danger'
        });
      }

      throw err;
    });
  }

  var sequenceSaveSuccess = function sequenceSaveSuccess(res) {
    IndexUIActions.addResult(convertSequenceToSearchResult(res));
    FloatingAlertStore.addAlert({
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "alerts.sequenceAdded"
      }),
      message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "alerts.sequenceAddedMessage",
        options: {
          name: sequence.get('name')
        }
      }),
      type: 'success'
    });
    return res;
  };

  var sequenceSaveFailure = function sequenceSaveFailure(err) {
    if (showErrorAlert) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.sequenceNotAdded"
        }),
        message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "alerts.sequenceNotAddedMessage",
          options: {
            name: sequence.get('name')
          }
        }),
        type: 'danger'
      });
    }

    throw err;
  };

  return SequenceApi.create(sequence.toJS()).then(sequenceSaveSuccess, sequenceSaveFailure);
};
export var saveSequences = function saveSequences(sequences, templates) {
  return function (dispatch) {
    var promises = templates.map(function (template) {
      var sequenceIndex = template.sequenceIndex,
          stepOrder = template.stepOrder;
      return TemplateApi.createTemplate(template).then(function (templateData) {
        dispatch(TemplateActions.createNewTemplate(templateData));
        return {
          sequenceIndex: sequenceIndex,
          stepOrder: stepOrder,
          templateId: templateData.get('id')
        };
      });
    }).toJS();
    return Promise.all(promises).then(function (_ref2) {
      var _ref3 = _toArray(_ref2),
          templateIds = _ref3.slice(0);

      var updatedSequences = templateIds.reduce(function (_updatedSequences, templateData) {
        var sequenceIndex = templateData.sequenceIndex,
            stepOrder = templateData.stepOrder,
            templateId = templateData.templateId;
        return _updatedSequences.updateIn([sequenceIndex, 'steps', stepOrder], function (step) {
          var isTask = step.action === SequenceStepTypes.SCHEDULE_TASK;
          var stepTypeMetaKey = isTask ? 'taskMeta' : 'templateMeta';
          var stepTypeMeta = isTask ? Object.assign({}, step.actionMeta.taskMeta, {
            manualEmailMeta: {
              templateId: templateId
            }
          }) : {
            id: templateId
          };
          return Object.assign({}, step, {
            actionMeta: Object.assign({}, step.actionMeta, _defineProperty({}, stepTypeMetaKey, stepTypeMeta))
          });
        });
      }, sequences);
      var savePromises = updatedSequences.map(function (sequence) {
        return save({
          sequence: sequence
        });
      }).toArray();
      return Promise.all(savePromises);
    }).catch(function (err) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.sequencesNotAdded"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.sequencesNotAddedMessage"
        }),
        type: 'danger'
      });
      throw err;
    });
  };
};
export var enroll = function enroll(_ref4) {
  var enrollment = _ref4.enrollment,
      vid = _ref4.vid,
      isReenroll = _ref4.isReenroll;
  return function (dispatch) {
    var _getEnrollAlertMessag = getEnrollAlertMessage(isReenroll),
        successTitle = _getEnrollAlertMessag.successTitle,
        failureTitle = _getEnrollAlertMessag.failureTitle,
        failureMessage = _getEnrollAlertMessag.failureMessage;

    return SequenceApi.enroll(enrollment, vid).then(function (res) {
      FloatingAlertStore.addAlert({
        titleText: unescapedText(successTitle, {
          email: res.get('toEmail'),
          sequenceName: enrollment.get('name')
        }),
        type: 'success'
      });
      dispatch(sequenceEnrollSucceeded(res));
      trackSingleEnrollSuccess(SEQUENCESUI);
      return res;
    }, function (err) {
      trackSingleEnrollError(SEQUENCESUI, err);

      if (err.responseJSON && err.responseJSON.errorType === EnrollErrorTypes.SEND_TIME_TOO_FAR_IN_PAST) {
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: failureTitle
          }),
          message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "alerts.sequenceSendTimeTooFarInPastErrorMessage_jsx",
            options: {
              microsoftHref: links.microsoftDateTimeSettings(),
              appleHref: links.appleDateTimeSettings()
            },
            elements: {
              AppleSettingsLink: UILink,
              MicrosoftSettingsLink: UILink
            }
          }),
          type: 'danger'
        });
        Raven.captureMessage('Sequence enroll error first step in past', {
          extra: {
            statusCode: err.status,
            responseText: err.responseText
          }
        });
      } else {
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: failureTitle
          }),
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: failureMessage
          }),
          type: 'danger'
        });
        Raven.captureMessage('Sequence enroll error', {
          extra: {
            statusCode: err.status,
            statusText: err.statusText,
            responseText: err.responseText
          }
        });
      }

      throw err;
    });
  };
};
export var bulkEnroll = function bulkEnroll(_ref5) {
  var enrollments = _ref5.enrollments;
  return function (dispatch) {
    var sequenceName = enrollments.first().get('name');
    var sequenceId = enrollments.first().get('id');
    var updatedEnrollments = enrollments.map(function (enrollment) {
      return enrollment.set('userPlatform', 'SEQUENCES_UI');
    });
    return SequenceApi.bulkEnroll(updatedEnrollments).then(function (res) {
      var successes = res.get('successes');
      var failures = res.get('failures');

      if (failures.size === 0) {
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "alerts.sequenceBulkEnroll.success.title"
          }),
          message: unescapedText('alerts.sequenceBulkEnroll.success.message', {
            count: successes.size,
            sequenceName: sequenceName
          }),
          type: 'success'
        });
      } else {
        // All enrollments absolute times start from the same timestamp so if the first one has this error,
        // they probably all do.
        if (res.get('failuresByKey').first().get('errorType') === EnrollErrorTypes.SEND_TIME_TOO_FAR_IN_PAST) {
          FloatingAlertStore.addAlert({
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "alerts.sequenceBulkEnroll.partialError.title"
            }),
            message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
              message: "alerts.sequenceSendTimeTooFarInPastErrorMessage_jsx",
              options: {
                microsoftHref: links.microsoftDateTimeSettings(),
                appleHref: links.appleDateTimeSettings()
              },
              elements: {
                AppleSettingsLink: UILink,
                MicrosoftSettingsLink: UILink
              }
            }),
            type: 'danger'
          });
          Raven.captureMessage('Sequence bulk enroll error first step in past');
        } else {
          FloatingAlertStore.addAlert({
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "alerts.sequenceBulkEnroll.partialError.title"
            }),
            message: unescapedText('alerts.sequenceBulkEnroll.partialError.message'),
            type: 'warning'
          });
        }
      }

      dispatch(bulkEnrollSucceeded({
        results: res,
        sequenceId: sequenceId
      }));
      return res;
    }, function (err) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.sequenceBulkEnroll.error.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "alerts.sequenceBulkEnroll.error.message"
        }),
        type: 'danger'
      });
      Raven.captureMessage('Sequence bulk enroll error', {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText
        }
      });
      throw err;
    });
  };
};
var _pendingFetchEnrollment = {};
export var fetchEnrollment = function fetchEnrollment(vid) {
  return function (dispatch) {
    if (!_pendingFetchEnrollment[vid]) {
      _pendingFetchEnrollment[vid] = SequenceApi.fetchEnrollment(vid).then(function (res) {
        dispatch(enrollmentFetchSucceeded({
          vid: vid,
          enrollmentState: res
        }));
      }).finally(function () {
        _pendingFetchEnrollment[vid] = null;
      });
    }
  };
};
export var fetchSummaryCount = function fetchSummaryCount(sequenceId) {
  return function (dispatch) {
    dispatch(summaryCountFetchStarted(ImmutableMap().set("" + sequenceId, ImmutableMap())));
    SummaryApi.fetchEnrollmentTotals(sequenceId).then(function (results) {
      dispatch(summaryCountFetchSucceeded(ImmutableMap().set("" + sequenceId, results)));
    });
  };
};
export var fetchPastEnrollment = function fetchPastEnrollment(enrollmentId) {
  return function (dispatch) {
    SequenceApi.fetchPastEnrollment(enrollmentId).then(function (result) {
      dispatch(pastEnrollmentFetchSucceeded(ImmutableMap().set(enrollmentId, result)));
    }, function (err) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.pastEnrollments.failedFetch.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.pastEnrollments.failedFetch.CTA"
        }),
        type: 'danger'
      });
      throw err;
    });
  };
};
export var fetchSequencesUsage = function fetchSequencesUsage() {
  return function (dispatch) {
    SequenceApi.fetchSequencesUsage().then(function (usage) {
      return dispatch(sequencesUsageFetchSucceeded(usage));
    });
  };
};
export var pauseAll = function pauseAll() {
  var sequenceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return function (dispatch) {
    var successActionType = sequenceId === null ? SequenceActionTypes.SEQUENCE_PAUSE_ALL_ENROLLMENTS_SUCCESS : SequenceActionTypes.SEQUENCE_PAUSE_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS;
    SequenceApi.pauseAll(getUserId(), sequenceId).then(function (_ref6) {
      var actionableIds = _ref6.actionableIds;
      dispatch({
        type: successActionType,
        payload: {
          actionableIds: actionableIds,
          numContacts: actionableIds.length,
          sequenceId: sequenceId
        }
      });
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.success"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.alerts.sequencePause.success",
          options: {
            count: actionableIds.length
          }
        }),
        type: 'success'
      });
      setTimeout(function () {
        dispatch(enrollmentPollingResolved(actionableIds.map(function (id) {
          return id.toString();
        })));
      }, BULK_ACTION_RESOLVE_TIMEOUT_SECONDS * 1000);
    }).catch(function (err) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.error"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.alerts.sequencePause.error"
        }),
        type: 'danger'
      });
      throw err;
    });
  };
};
export var resumeAll = function resumeAll() {
  var sequenceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return function (dispatch) {
    var successActionType = sequenceId === null ? SequenceActionTypes.SEQUENCE_RESUME_ALL_ENROLLMENTS_SUCCESS : SequenceActionTypes.SEQUENCE_RESUME_ENROLLMENTS_BY_SEQUENCE_ID_SUCCESS;
    SequenceApi.resumeAll(getUserId(), sequenceId).then(function (_ref7) {
      var actionableIds = _ref7.actionableIds;
      dispatch({
        type: successActionType,
        payload: {
          actionableIds: actionableIds,
          numContacts: actionableIds.length,
          sequenceId: sequenceId
        }
      });
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.alerts.sequenceResume.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.alerts.sequenceResume.success",
          options: {
            count: actionableIds.length
          }
        }),
        type: 'success'
      });
      setTimeout(function () {
        dispatch(enrollmentPollingResolved(actionableIds.map(function (id) {
          return id.toString();
        })));
      }, BULK_ACTION_RESOLVE_TIMEOUT_SECONDS * 1000);
    }).catch(function (err) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.error"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.alerts.sequenceResume.error"
        }),
        type: 'danger'
      });
      throw err;
    });
  };
};
export var fetchActiveSequenceContacts = function fetchActiveSequenceContacts(sequenceId) {
  return function (dispatch) {
    CRMSearchApi.fetchSequenceContacts(sequenceId, getUserId(), true).then(function (res) {
      dispatch({
        type: SequenceActionTypes.SEQUENCE_NUM_ACTIVE_CONTACTS_FOR_SEQUENCE_ID_FETCH_SUCCESS,
        payload: {
          sequenceId: sequenceId,
          contacts: res
        }
      });
    });
  };
};
export var fetchPausedSequenceContacts = function fetchPausedSequenceContacts(sequenceId) {
  return function (dispatch) {
    CRMSearchApi.fetchSequenceContacts(sequenceId, getUserId(), false).then(function (res) {
      dispatch({
        type: SequenceActionTypes.SEQUENCE_NUM_PAUSED_CONTACTS_FOR_SEQUENCE_ID_FETCH_SUCCESS,
        payload: {
          sequenceId: sequenceId,
          contacts: res
        }
      });
    });
  };
};
export var fetchAllActiveSequenceContacts = function fetchAllActiveSequenceContacts() {
  return function (dispatch) {
    CRMSearchApi.fetchAllUserContacts(getUserId(), true).then(function (res) {
      dispatch({
        type: SequenceActionTypes.SEQUENCE_NUM_ALL_ACTIVE_CONTACTS_FETCH_SUCCESS,
        payload: {
          contacts: res
        }
      });
    });
  };
};
export var fetchAllPausedSequenceContacts = function fetchAllPausedSequenceContacts() {
  return function (dispatch) {
    CRMSearchApi.fetchAllUserContacts(getUserId(), false).then(function (res) {
      dispatch({
        type: SequenceActionTypes.SEQUENCE_NUM_ALL_PAUSED_CONTACTS_FETCH_SUCCESS,
        payload: {
          contacts: res
        }
      });
    });
  };
};