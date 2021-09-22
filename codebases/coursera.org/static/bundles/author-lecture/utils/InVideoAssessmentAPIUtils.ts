import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';
import user from 'js/lib/user';

import LectureServerActionCreators from 'bundles/author-lecture/actions/LectureServerActionCreators';
import InVideoAssessmentServerActionCreators from 'bundles/author-lecture/actions/InVideoAssessmentServerActionCreators';

const inVideoAssessmentsApi = API('/api/authoringInVideoAssessments.v1/', {
  type: 'rest',
});

const REQUEST_FIELDS = 'writeAccessToken,writeAccessState';
const CONFLICT_ERROR_STATUS = 409;

const handleAPIError = function (error: $TSFixMe, errorActionCreator: $TSFixMe, conflictActionCreator: $TSFixMe) {
  if (error.status === CONFLICT_ERROR_STATUS && conflictActionCreator) {
    conflictActionCreator(error);
  } else {
    errorActionCreator(error);
  }

  return Q.reject(error);
};

const InVideoAssessmentAPIUtils = {
  get(lectureDraftId: $TSFixMe) {
    const uri = new URI(lectureDraftId.toString()).addQueryParam('fields', REQUEST_FIELDS);

    return (
      Q(inVideoAssessmentsApi.get(uri.toString()))
        .then((response) => {
          const inVideoAssessmentAuthoringData = response.elements[0];
          InVideoAssessmentServerActionCreators.receiveInVideoAssessment(inVideoAssessmentAuthoringData);

          return inVideoAssessmentAuthoringData;
        })
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        .catch((error) => handleAPIError(error, LectureServerActionCreators.loadError))
    );
  },

  update(lectureDraftId: $TSFixMe, assessment: $TSFixMe, lectureDraftMetadata: $TSFixMe, writeAccessToken: $TSFixMe) {
    const uri = new URI(lectureDraftId.toString()).addQueryParam('fields', REQUEST_FIELDS);

    return Q(
      inVideoAssessmentsApi.put(uri.toString(), {
        data: {
          assessment,
          lectureDraftMetadata,
          writeAccessToken,
          userId: user.get().id,
        },
      })
    )
      .then((response) => {
        const inVideoAssessmentAuthoringData = response.elements[0];

        InVideoAssessmentServerActionCreators.receiveInVideoAssessment(inVideoAssessmentAuthoringData);

        return inVideoAssessmentAuthoringData;
      })
      .catch((error) =>
        handleAPIError(error, LectureServerActionCreators.loadError, LectureServerActionCreators.conflict)
      );
  },
};

export default InVideoAssessmentAPIUtils;

export const { get, update } = InVideoAssessmentAPIUtils;
