'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { registerMutation, useMutation } from 'data-fetching-client';
import { useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as SequenceApi from '../api/SequenceApi';
import * as SequenceActionTypes from 'SequencesUI/constants/SequenceActionTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { useDispatch } from 'react-redux';
import { GET_SEQUENCE_ENROLLMENTS } from 'SequencesUI/query/sequenceEnrollmentQuery';
var UNENROLL_ENROLLMENTS = registerMutation({
  fieldName: 'unenroll',
  args: ['enrollments'],
  fetcher: function fetcher(_ref) {
    var enrollments = _ref.enrollments;
    return SequenceApi.unenrollBatch(enrollments.map(function (enrollment) {
      return getPropertyValue(enrollment, 'hs_enrollment_id');
    }));
  }
});
export var useUnenrollEnrollments = function useUnenrollEnrollments(query, enrollmentsToUnenroll) {
  var dispatch = useDispatch();

  var _useMutation = useMutation(UNENROLL_ENROLLMENTS, {
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
            if (!enrollmentsToUnenroll.includes(enrollment)) {
              return enrollment;
            }

            return Object.assign({}, enrollment, {
              properties: Object.assign({}, enrollment.properties, {
                hs_enrollment_state: Object.assign({}, enrollment.properties.hs_enrollment_state, {
                  value: 'UNENROLLED'
                }),
                hs_unenrolled_source: Object.assign({}, enrollment.properties.hs_unenrolled_source, {
                  value: 'MANUAL'
                })
              })
            });
          })
        })
      }); // TODO For now some things are still in redux

      dispatch({
        type: SequenceActionTypes.UNENROLL_BATCH_SUCCESS_CRMOBJECTS,
        payload: enrollmentsToUnenroll
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

  var unenroll = useCallback(function (contactName) {
    mutationFn({
      variables: {
        enrollments: enrollmentsToUnenroll
      }
    }).then(function () {
      var message;

      if (enrollmentsToUnenroll.size === 1) {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.singleUnenrollSuccess",
          options: {
            contactName: contactName
          }
        });
      } else {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.multipleUnenrollSuccess",
          options: {
            count: enrollmentsToUnenroll.size
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
    }).catch(function (error) {
      var message;

      if (enrollmentsToUnenroll.size === 1) {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.singleUnenrollFailed",
          options: {
            contactName: contactName
          }
        });
      } else {
        message = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.multipleUnenrollFailed",
          options: {
            count: enrollmentsToUnenroll.size
          }
        });
      }

      FloatingAlertStore.addAlert({
        message: message,
        type: 'danger'
      });
      return Promise.reject(error);
    });
  }, [mutationFn, enrollmentsToUnenroll]);
  return [unenroll, mutationResult];
};