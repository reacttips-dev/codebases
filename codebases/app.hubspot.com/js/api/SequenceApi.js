'use es6';

import Raven from 'Raven';
import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import ReportRecord from 'SequencesUI/records/ReportRecord';
export function fetch(id) {
  var url = id ? "sequences/v2/sequences/" + id : 'sequences/v1/sequence';
  return apiClient.get(url).then(fromJS);
}
export function create(attrs) {
  return apiClient.post('sequences/v1/sequence', {
    data: Object.assign({}, attrs)
  }).then(fromJS);
}
export function clone(attrs) {
  return apiClient.post("sequences/v2/sequences/clone", {
    data: attrs
  }).then(fromJS);
}
export function update(id, attrs) {
  return apiClient.put("sequences/v2/sequences/" + id, {
    data: Object.assign({}, attrs)
  }).then(fromJS);
}
export function deleteBatch(sequenceIds) {
  return apiClient.delete("sequences/v1/sequence/batch", {
    data: {
      ids: sequenceIds
    }
  });
}
export function unenroll(enrollmentId) {
  return apiClient.post("sequences/v1/enrollment/" + enrollmentId + "/unenroll").then(fromJS);
}
export function unenrollBatch(enrollmentIds) {
  return apiClient.post("sequences/v1/enrollment/unenroll/batch", {
    data: {
      ids: enrollmentIds.toJS()
    }
  }).then(fromJS);
}
export function unenrollQuery(query) {
  return apiClient.post('sequences/v2/enrollments/unenroll/batch-crm-query', {
    data: {
      objectTypeId: 'SEQUENCE_ENROLLMENT',
      requestOptions: {
        includeAllValues: true
      },
      filterGroups: query.filterGroups
    }
  });
}
export function pauseEnrollments(enrollmentIds) {
  return apiClient.post('sequences/v2/enrollments/batch/actions/pause', {
    data: {
      inputs: enrollmentIds
    }
  });
}
export function pauseQuery(query) {
  return apiClient.post('sequences/v2/enrollments/pause/batch-crm-query', {
    data: {
      objectTypeId: 'SEQUENCE_ENROLLMENT',
      requestOptions: {
        includeAllValues: true
      },
      filterGroups: query.filterGroups
    }
  });
}
export function resumeEnrollments(enrollmentIds) {
  var timeAdjustmentStrategy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'CONTINUE_DELAY';
  var queryString = "?timeAdjustmentStrategy=" + timeAdjustmentStrategy;
  return apiClient.post("sequences/v2/enrollments/batch/actions/unpause" + queryString, {
    data: {
      inputs: enrollmentIds
    }
  });
}
export function resumeQuery(query) {
  var timeAdjustmentStrategy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'CONTINUE_DELAY';
  var queryString = "?timeAdjustmentStrategy=" + timeAdjustmentStrategy;
  return apiClient.post("sequences/v2/enrollments/unpause/batch-crm-query" + queryString, {
    data: {
      objectTypeId: 'SEQUENCE_ENROLLMENT',
      requestOptions: {
        includeAllValues: true
      },
      filterGroups: query.filterGroups
    }
  });
}
export function resumeEnrollment(enrollment) {
  return apiClient.post('sequences/v2/enrollments/actions/update-and-unpause', {
    data: enrollment.toJS()
  }).then(fromJS);
}
export function enroll(sequence, vid) {
  var url = "sequences/v1/enrollment/vid/" + vid;
  var data = {
    sequence: sequence.toJS(),
    steps: []
  };
  return apiClient.post(url, {
    data: data
  }).then(fromJS);
}
export function bulkEnroll(enrollments) {
  var data = enrollments.map(function (enrollment, id) {
    return {
      enrollment: {
        sequence: enrollment.toJS()
      },
      vid: id
    };
  }).toList();
  return apiClient.post('sequences/v2/enrollments/enroll/batch', {
    data: data,
    timeout: 60000
  }).then(fromJS);
}
export function fetchEnrollment(vid) {
  return apiClient.get("sequences/v2/enrollments/vid/" + vid + "/state").then(fromJS);
}
export function fetchPastEnrollment(id) {
  return apiClient.get("sequences/v1/enrollment/" + id).then(fromJS);
}
export function fetchResumePreview(enrollmentId) {
  var timeAdjustmentStrategy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'CONTINUE_DELAY';
  return apiClient.get("sequences/v2/enrollments/" + enrollmentId + "/time-adjustment-preview?timeAdjustmentStrategy=" + timeAdjustmentStrategy).then(fromJS);
}
export function moveSequences(sequenceIds, folderId) {
  return apiClient.put('sequences/v1/sequence/move-to-folder/batch', {
    data: {
      sequenceIds: sequenceIds.toArray(),
      destinationFolderId: folderId
    }
  }).then(fromJS);
}
export function fetchReport(_ref) {
  var sequenceId = _ref.sequenceId,
      start = _ref.start,
      end = _ref.end,
      enrolledBy = _ref.enrolledBy;
  var query = {};

  if (start) {
    query.enrolledAfter = start;
  }

  if (end) {
    query.enrolledBefore = end;
  }

  if (enrolledBy) {
    query.enrolledBy = enrolledBy;
  }

  return apiClient.get("sequences/v2/report/" + sequenceId, {
    query: query,
    timeout: 20000
  }).then(function (response) {
    return ReportRecord.fromApi(fromJS(response));
  }, function (err) {
    if (err.status !== 403) {
      var message = err.status === 0 ? 'timeout' : 'non-timeout';
      Raven.captureMessage("Sequence report fetch " + message + " error", {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText,
          sequenceId: sequenceId,
          query: query
        }
      });
    }

    throw err;
  });
}
export function fetchSequencesUsage() {
  return apiClient.get('sequences/v2/sequences/usage');
}
export function pauseAll(userId) {
  var sequenceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var sequenceQuery = sequenceId ? [{
    property: 'hs_sequence_id',
    value: sequenceId,
    operator: 'EQ'
  }] : [];
  var query = {
    objectTypeId: 'SEQUENCE_ENROLLMENT',
    requestOptions: {
      includeAllValues: true
    },
    filterGroups: [{
      filters: [{
        property: 'hs_enrollment_state',
        value: 'EXECUTING',
        operator: 'EQ'
      }, {
        property: 'hs_enrolled_by',
        value: userId,
        operator: 'EQ'
      }].concat(sequenceQuery)
    }]
  };
  return apiClient.post('sequences/v2/enrollments/pause/batch-crm-query', {
    data: query
  });
}
export function resumeAll(userId) {
  var sequenceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var sequenceQuery = sequenceId ? [{
    property: 'hs_sequence_id',
    value: sequenceId,
    operator: 'EQ'
  }] : [];
  var query = {
    objectTypeId: 'SEQUENCE_ENROLLMENT',
    requestOptions: {
      includeAllValues: true
    },
    filterGroups: [{
      filters: [{
        property: 'hs_enrollment_state',
        value: 'PAUSED',
        operator: 'EQ'
      }, {
        property: 'hs_enrolled_by',
        value: userId,
        operator: 'EQ'
      }].concat(sequenceQuery)
    }]
  };
  return apiClient.post('sequences/v2/enrollments/unpause/batch-crm-query/?timeAdjustmentStrategy=CONTINUE_DELAY', {
    data: query
  });
}