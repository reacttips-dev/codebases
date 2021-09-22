import { SkipReviewReport } from 'bundles/peer/types/Reviews';

import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

const onDemandPeerSkipReviewsApi = API('/api/onDemandPeerSkipReviews.v1', {
  type: 'rest',
});

/* eslint-disable import/prefer-default-export */
export const skipReview = ({
  userId,
  courseId,
  itemId,
  submissionId,
  report,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  submissionId: string;
  report: SkipReviewReport;
}): Q.Promise<void> => {
  const uri = new URI();

  const data = {
    userPeerSubmissionId: `${userId}~${courseId}~${itemId}~${submissionId}`,
    reason: {
      typeName: report.reason,
      definition: {
        explanation: report.evidence,
      },
    },
  };

  return Q(onDemandPeerSkipReviewsApi.post(uri.toString(), { data }));
};
