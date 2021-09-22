import {
  OnDemandPeerReceivedReviewsV1Response,
  ReviewAndMetadata,
} from 'bundles/peer/api/onDemandPeerReceivedReviewsApi';
import { ReviewMetadata, ReviewsResponse } from 'bundles/peer/types/Reviews';

import _ from 'underscore';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

const formatReviewMetadata = (rawReview: ReviewAndMetadata): ReviewMetadata => {
  const newProperties = {
    definition: rawReview.review,
    typeName: 'structured',
    submissionId: _.last(stringKeyToTuple(rawReview.peerSubmissionId)),
    id: _.last(stringKeyToTuple(rawReview.id)),
    assignmentId: rawReview.attachedAssignmentId,
    // isAnonymous: true,
  };

  // Omit properties we already transformed
  const newReview = _(rawReview).omit('review', 'peerSubmissionId', 'id', 'attachedAssignmentId');

  return Object.assign({}, newReview, newProperties);
};

// Takes in a Naptime response. Constructs and returns Backbone Review models
const convertNaptimeReceivedReviewsResponse = (data: OnDemandPeerReceivedReviewsV1Response): ReviewsResponse => {
  const reviews = _.map(data.elements, formatReviewMetadata);
  const userProfiles = data.linked['onDemandSocialProfiles.v1'];

  return {
    reviews,
    userProfiles,
  };
};

export default convertNaptimeReceivedReviewsResponse;
