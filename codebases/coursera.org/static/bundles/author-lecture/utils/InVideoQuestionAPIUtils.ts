import Q from 'q';
import _ from 'underscore';
import API from 'js/lib/api';
import URI from 'jsuri';
import user from 'js/lib/user';

import LectureServerActionCreators from 'bundles/author-lecture/actions/LectureServerActionCreators';
import InVideoQuestionServerActionCreators from 'bundles/author-lecture/actions/InVideoQuestionServerActionCreators';

const inVideoQuestionsApi = API('/api/authoringInVideoQuestions.v2/', {
  type: 'rest',
});
const CONFLICT_ERROR_STATUS = 409;
const REQUEST_FIELDS = 'writeAccessToken,writeAccessState';

const handleAPIError = function (error: $TSFixMe, errorActionCreator: $TSFixMe, conflictActionCreator: $TSFixMe) {
  if (error.status === CONFLICT_ERROR_STATUS && conflictActionCreator) {
    conflictActionCreator(error);
  } else {
    errorActionCreator(error);
  }

  return Q.reject(error);
};

// TODO: Move all cuepoint and order logic into InVideoAssessmentAPIUtils
const InVideoQuestionAPIUtils = {
  create(lectureDraftId: $TSFixMe, question: $TSFixMe, lectureDraftMetadata: $TSFixMe, writeAccessToken: $TSFixMe) {
    return Q(
      inVideoQuestionsApi.post('', {
        data: {
          lectureDraftId: lectureDraftId.toString(),
          question,
          lectureDraftMetadata,
          writeAccessToken,
          userId: user.get().id,
        },
      })
    ).then((response) => {
      const inVideoQuestionAuthoringData = response.elements[0];
      InVideoQuestionServerActionCreators.receiveNewInVideoQuestion(inVideoQuestionAuthoringData);

      return inVideoQuestionAuthoringData;
    });
  },

  // TODO: Decouple cuepoint/order into assessment update
  update(id: $TSFixMe, question: $TSFixMe, lectureDraftMetadata: $TSFixMe, writeAccessToken: $TSFixMe) {
    const uri = new URI(id).addQueryParam('fields', REQUEST_FIELDS);

    return Q(
      inVideoQuestionsApi.put(uri.toString(), {
        data: {
          question,
          lectureDraftMetadata,
          writeAccessToken,
          userId: user.get().id,
        },
      })
    )
      .then((response) => response.elements[0])
      .catch((error) =>
        handleAPIError(error, LectureServerActionCreators.loadError, LectureServerActionCreators.conflict)
      );
  },

  // TODO: Use a multiget/finder instead.
  getAll(
    publishedInVideoQuestionDraftIds: $TSFixMe,
    draftInVideoQuestionDraftIds: $TSFixMe,
    cuePointMsMaps: $TSFixMe,
    orderMaps: $TSFixMe
  ) {
    const questionRequests = _(publishedInVideoQuestionDraftIds.concat(draftInVideoQuestionDraftIds))
      .chain()
      .uniq()
      .map((inVideoQuestionDraftId) => {
        const uri = new URI(inVideoQuestionDraftId.toString()).addQueryParam('fields', REQUEST_FIELDS);
        return Q(inVideoQuestionsApi.get(uri.toString()));
      })
      .value();

    return (
      Q.all(questionRequests)
        .then((responses) => {
          const inVideoQuestionAuthoringDataList = _(responses).map((response) => response.elements[0]);

          InVideoQuestionServerActionCreators.receiveAllInVideoQuestions(
            inVideoQuestionAuthoringDataList,
            cuePointMsMaps,
            orderMaps
          );

          return inVideoQuestionAuthoringDataList;
        })
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        .catch((error) => handleAPIError(error, LectureServerActionCreators.loadError))
    );
  },
};

export default InVideoQuestionAPIUtils;

export const { create, update, getAll } = InVideoQuestionAPIUtils;
