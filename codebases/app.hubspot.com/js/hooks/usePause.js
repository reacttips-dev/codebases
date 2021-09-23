'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { registerMutation, useMutation } from 'data-fetching-client';
import { useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as SequenceApi from '../api/SequenceApi';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { GET_SEQUENCE_ENROLLMENTS } from 'SequencesUI/query/sequenceEnrollmentQuery';
var PAUSE_ENROLLMENTS = registerMutation({
  fieldName: 'pause',
  args: ['enrollments'],
  fetcher: function fetcher(_ref) {
    var enrollments = _ref.enrollments;
    return SequenceApi.pauseEnrollments(enrollments.map(function (enrollment) {
      return getPropertyValue(enrollment, 'hs_enrollment_id');
    }).toJS());
  }
});
export var usePauseEnrollments = function usePauseEnrollments(query, enrollmentsToPause) {
  var _useMutation = useMutation(PAUSE_ENROLLMENTS, {
    update: function update(cache) {
      var existing = cache.readQuery({
        query: GET_SEQUENCE_ENROLLMENTS,
        variables: {
          query: query
        }
      });
      var updated = Object.assign({}, existing, {
        sequenceEnrollments: Object.assign({}, existing.sequenceEnrollments, {
          results: existing.sequenceEnrollments.results.map(function (enrollment) {
            if (!enrollmentsToPause.includes(enrollment)) {
              return enrollment;
            }

            return Object.assign({}, enrollment, {
              properties: Object.assign({}, enrollment.properties, {
                hs_enrollment_state: Object.assign({}, enrollment.properties.hs_enrollment_state, {
                  value: 'PAUSED'
                })
              })
            });
          })
        })
      });
      cache.writeQuery({
        query: GET_SEQUENCE_ENROLLMENTS,
        variables: {
          query: query
        },
        data: updated
      });
    }
  }),
      _useMutation2 = _slicedToArray(_useMutation, 2),
      mutationFn = _useMutation2[0],
      mutationResult = _useMutation2[1];

  var pause = useCallback(function (contactName) {
    mutationFn({
      variables: {
        enrollments: enrollmentsToPause
      }
    }).then(function () {
      var message;

      if (enrollmentsToPause.size === 1) {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.singlePauseSuccess",
          options: {
            contactName: contactName
          }
        });
      } else {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.multiplePauseSuccess",
          options: {
            count: enrollmentsToPause.size
          }
        });
      }

      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.success"
        }),
        message: message,
        type: 'success'
      });
    }).catch(function () {
      var message;

      if (enrollmentsToPause.size === 1) {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.singlePauseFailed",
          options: {
            contactName: contactName
          }
        });
      } else {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.multiplePauseFailed",
          options: {
            count: enrollmentsToPause.size
          }
        });
      }

      FloatingAlertStore.addAlert({
        message: message,
        type: 'danger'
      });
    });
  }, [mutationFn, enrollmentsToPause]);
  return [pause, mutationResult];
};