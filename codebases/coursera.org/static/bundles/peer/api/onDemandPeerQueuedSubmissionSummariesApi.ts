import { SocialProfile } from 'bundles/assess-common/types/SocialProfile';
import { SubmissionSummaryResponse } from 'bundles/peer/types/SubmissionSummary';

import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

const onDemandPeerQueuedSubmissionSummaries = API('/api/onDemandPeerQueuedSubmissionSummaries.v1', { type: 'rest' });

const submissionSummariesFields = ['submissionSummary', 'reviewingComplete'];

const socialProfileFields = ['userId', 'externalUserId', 'fullName', 'photoUrl', 'courseRole', 'isSuperuser'];

export type OnDemandPeerQueuedSubmissionSummariesV1Response = {
  elements: Array<SubmissionSummaryResponse>;
  paging: any;
  linked: {
    'onDemandSocialProfiles.v1': Array<SocialProfile>;
  };
};

// Get ordered list of submissions-to-be-reviewed
/* eslint-disable import/prefer-default-export */
export const getReviewQueue = ({
  userId,
  courseId,
  itemId,
  limit,
  start,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  limit?: number;
  start?: number;
}): Q.Promise<OnDemandPeerQueuedSubmissionSummariesV1Response> => {
  const joinedSubmissionSummariesFields = submissionSummariesFields.join(',');
  const joinedSocialProfileFields = `onDemandSocialProfiles.v1(${socialProfileFields.join(',')})`;

  const uri = new URI()
    .addQueryParam('q', 'reviewQueue')
    .addQueryParam('userId', userId.toString())
    .addQueryParam('courseId', courseId)
    .addQueryParam('itemId', itemId)
    .addQueryParam('includes', 'profiles')
    .addQueryParam('fields', [joinedSubmissionSummariesFields, joinedSocialProfileFields].join(','));

  if (start) {
    uri.addQueryParam('start', `${start}`);
  }
  if (limit) {
    uri.addQueryParam('limit', `${limit}`);
  } else {
    uri.addQueryParam('limit', '10');
  }

  return Q(onDemandPeerQueuedSubmissionSummaries.get(uri.toString()));
};
