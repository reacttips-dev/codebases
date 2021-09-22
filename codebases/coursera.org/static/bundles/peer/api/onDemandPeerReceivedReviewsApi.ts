import { SocialProfile } from 'bundles/assess-common/types/SocialProfile';
import { ReviewDefinition } from 'bundles/peer/types/Reviews';

import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

const onDemandPeerReceivedReviewsApi = API('/api/onDemandPeerReceivedReviews.v1', { type: 'rest' });

const receivedReviewsFields = [
  'review',
  'attachedAssignmentId',
  'creatorId',
  'createdAt',
  'peerSubmissionId',
  'isMentorReview',
  'isAnonymous',
];

const socialProfileFields = [
  'userId',
  'externalUserId',
  'fullName',
  'photoUrl',
  'courseRole',
  'isSuperuser',
  'isAnonymous',
];

export type ReviewAndMetadata = {
  review: ReviewDefinition;
  attachedAssignmentId: string;
  creatorId: number;
  createdAt: number;
  peerSubmissionId: string;
  id: string;
  isMentorReview: boolean;
};

export type OnDemandPeerReceivedReviewsV1Response = {
  elements: Array<ReviewAndMetadata>;
  paging: any;
  linked: {
    'onDemandSocialProfiles.v1': Array<SocialProfile>;
  };
};

// Fetches all reviews of a submission while also pulling in reviewers' profiles
/* eslint-disable import/prefer-default-export */
export const getReviews = ({
  userId,
  courseId,
  itemId,
  submissionId,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  submissionId: string;
}): Q.Promise<OnDemandPeerReceivedReviewsV1Response> => {
  const joinedReceivedReviewsFields = receivedReviewsFields.join(',');
  const joinedSocialProfileFields = `onDemandSocialProfiles.v1(${socialProfileFields.join(',')})`;

  const uri = new URI()
    .addQueryParam('peerSubmissionId', `${courseId}~${itemId}~${submissionId}`)
    .addQueryParam('userId', userId.toString())
    .addQueryParam('q', 'visibleBySubmission')
    .addQueryParam('includes', 'profiles')
    .addQueryParam('fields', [joinedReceivedReviewsFields, joinedSocialProfileFields].join(','));

  return Q(onDemandPeerReceivedReviewsApi.get(uri.toString()));
};
