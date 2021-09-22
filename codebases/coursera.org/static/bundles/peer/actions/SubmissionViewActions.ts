import Q from 'q';

import user from 'js/lib/user';

import { getReviews } from 'bundles/peer/api/onDemandPeerReceivedReviewsApi';
import { skipReview } from 'bundles/peer/api/onDemandPeerSkipReviewsApi';
import * as onDemandPeerSubmissionsApi from 'bundles/peer/api/onDemandPeerSubmissionsApi';
import { getReviewQueue } from 'bundles/peer/api/onDemandPeerQueuedSubmissionSummariesApi';

import reviewResponseConverter from 'bundles/peer/utils/reviewResponseConverter';
import {
  convertNaptimeSubmissionToPublicSubmission,
  convertNaptimeReviewQueue,
} from 'bundles/peer/utils/responseConversionUtils';

import { ActionNames } from './constants';

const onLoadSuccess = (actionContext: $TSFixMe, submissionId: $TSFixMe) => ({
  submissionAndRelated,
  reviewsResponse,
}: $TSFixMe) => {
  // if this optional field does not exist, we cannot recover and should just show an error.
  if (submissionAndRelated == null || submissionAndRelated.reviewSchema == null) {
    actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR, {
      response: null,
      submissionId,
    });
  } else {
    actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOADED, {
      reviewsResponse: reviewResponseConverter(reviewsResponse),
      submissionId,
      submissionAndRelated,
      viewerId: user.get().id,
    });
  }
};

const onLoadError = (actionContext: $TSFixMe, submissionId: $TSFixMe) => (exception: $TSFixMe) => {
  if (exception.responseJSON) {
    // The exception is a jqXHR
    actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR, {
      response: exception.responseJSON,
      submissionId,
    });
  } else {
    // The exception is not a jqXHR. We have no idea what the exception is
    // and we have not satisfactorily handled it, so re-throw it.
    throw exception;
  }
};

export const loadSubmission = (actionContext: $TSFixMe, { courseId, itemId, userId, submissionId }: $TSFixMe) => {
  actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOADING, {
    itemId,
    submissionId,
  });

  return Q.all([
    onDemandPeerSubmissionsApi.getSubmission({
      userId,
      courseId,
      itemId,
      submissionId,
    }),
    getReviews({
      userId,
      courseId,
      itemId,
      submissionId,
    }),
  ])
    .spread((submission, reviewsResponse) => ({
      submissionAndRelated: convertNaptimeSubmissionToPublicSubmission(submission),
      reviewsResponse,
    }))
    .then(onLoadSuccess(actionContext, submissionId), onLoadError(actionContext, submissionId));
};

export const likeSubmission = (actionContext: $TSFixMe, { itemId, courseId, submissionId }: $TSFixMe) => {
  return onDemandPeerSubmissionsApi
    .upvote({
      userId: user.get().id,
      courseId,
      itemId,
      submissionId,
    })
    .then(() => {
      actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOCAL_LIKE_SUBMISSION, { submissionId });
    });
};

export const unlikeSubmission = (actionContext: $TSFixMe, { itemId, courseId, submissionId }: $TSFixMe) => {
  return onDemandPeerSubmissionsApi
    .cancelUpvote({
      userId: user.get().id,
      courseId,
      itemId,
      submissionId,
    })
    .then(() => {
      actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOCAL_UNDO_LIKE_SUBMISSION, { submissionId });
    });
};

export const loadNextReviewQueueSubmission = (actionContext: $TSFixMe, { userId, courseId, itemId }: $TSFixMe) => {
  const start = 0;
  const limit = 1;

  actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOADING, {
    itemId: undefined,
    submissionId: undefined,
  });

  return getReviewQueue({
    userId,
    courseId,
    itemId,
    start,
    limit,
  })
    .then((response) => {
      return convertNaptimeReviewQueue(response);
    })
    .then((data) => {
      const { submissionSummaries } = data;

      if (!submissionSummaries) {
        return actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR, { submissionId: undefined });
      } else if (submissionSummaries.length === 0) {
        // There is nothing in the review queue to be reviewed. Don't pull in a submission for review.
        return actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOAD_RESET, {});
      } else if (submissionSummaries.length > 0) {
        // Pull first submission from review queue.
        const submissionId = submissionSummaries[0].id;
        return actionContext.executeAction(loadSubmission, {
          userId,
          courseId,
          itemId,
          submissionId,
        });
      }
    })
    .catch((error) => {
      actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR, {
        submissionId: undefined,
      });
    });
};

export const flagSubmission = (actionContext: $TSFixMe, { itemId, courseId, submissionId, report }: $TSFixMe) => {
  actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_FLAGGING);
  const userId = user.get().id;

  return skipReview({
    userId,
    courseId,
    itemId,
    submissionId,
    report,
  })
    .then(() => {
      actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_FLAGGED);
      actionContext.executeAction(loadNextReviewQueueSubmission, {
        userId,
        courseId,
        itemId,
      });
    })
    .catch((flagSubmissionError) => {
      actionContext.dispatch(ActionNames.PEER_VIEW_SUBMISSION_FLAG_ERROR, {
        flagSubmissionError,
      });
    });
};
