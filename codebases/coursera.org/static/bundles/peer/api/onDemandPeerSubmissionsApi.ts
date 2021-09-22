import { SubmissionResponse } from 'bundles/peer/types/NaptimeSubmission';

import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

const onDemandPeerSubmissionsApi = API('/api/onDemandPeerSubmissions.v1', {
  type: 'rest',
});

const submissionFields = [
  'submission',
  'context',
  'creatorId',
  'attachedAssignmentId',
  'createdAt',
  'upgradeSubmissionToLatestAssignment',
  'blocksSubmit',
  'validationErrors',
  'upvotes',
  'isUpvotedByRequester',
  'isDeleted',
  'isLatestDeletedSubmissionDeletedByAdmin',
  'isAnonymous',
  'onDemandPeerReviewSchemas.v1(reviewSchema)',
  'onDemandPeerSubmissionSchemas.v1(submissionSchema)',
  'onDemandSocialProfiles.v1(userId,externalUserId,fullName,photoUrl,courseRole,isAnonymous)',
];

const includes = ['submissionSchemas', 'reviewSchemas', 'profiles'];

/*
 * The backend should guarantee that if no errors are thrown, there exists a single draft element. However, we want
 * to return a single element to the caller instead of the normal naptime elements response for ease of use, and
 * if we don't throw an error if this "impossible" case ocurrs it could be difficult to debug.
 */
function responseHandler(response: $TSFixMe /* TODO: type onDemandPeerSubmissionsApi */) {
  if (response.elements && response.elements.length) {
    const submissionSchema =
      response.linked['onDemandPeerSubmissionSchemas.v1'] && response.linked['onDemandPeerSubmissionSchemas.v1'][0];
    const reviewSchema =
      response.linked['onDemandPeerReviewSchemas.v1'] && response.linked['onDemandPeerReviewSchemas.v1'][0];
    const socialProfiles = response.linked['onDemandSocialProfiles.v1'];

    if (submissionSchema == null) {
      throw new Error('No linked submission schema in onDemandPeerSubmissionsApi');
    }
    return {
      ...response.elements[0],
      reviewSchema,
      submissionSchema,
      socialProfiles,
    };
  }

  throw new Error('No elements received in onDemandPeerSubmissionsApi');
}

export const getSubmission = ({
  userId,
  courseId,
  itemId,
  submissionId,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  submissionId?: string;
}): Q.Promise<SubmissionResponse> => {
  let uri: URI;
  if (submissionId != null) {
    uri = new URI(`${userId}~${courseId}~${itemId}~${submissionId}`);
  } else {
    uri = new URI()
      .addQueryParam('q', 'my')
      .addQueryParam('userId', `${userId}`)
      .addQueryParam('courseId', courseId)
      .addQueryParam('itemId', itemId);
  }

  uri.addQueryParam('fields', submissionFields.join(',')).addQueryParam('includes', includes.join(','));

  return Q(onDemandPeerSubmissionsApi.get(uri.toString())).then(responseHandler);
};

export const submitSubmission = ({
  courseId,
  itemId,
  draftCreatedAt,
  verifiableId,
}: {
  courseId: string;
  itemId: string;
  draftCreatedAt: number;
  verifiableId?: string;
}): Q.Promise<{}> => {
  const uri = new URI()
    .addQueryParam('fields', submissionFields.join(','))
    .addQueryParam('includes', includes.join(','));

  return Q(
    onDemandPeerSubmissionsApi.post(uri.toString(), {
      data: {
        courseId,
        itemId,
        draftCreatedAt,
        verifiableId,
      },
    })
  );
};

export const deleteSubmission = ({
  userId,
  courseId,
  itemId,
  submissionId,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  submissionId: string;
}): Q.Promise<{}> => {
  const id = `${userId}~${courseId}~${itemId}~${submissionId}`;
  const uri = new URI(id);

  return Q(onDemandPeerSubmissionsApi.delete(uri.toString()));
};

export const upvote = ({
  userId,
  courseId,
  itemId,
  submissionId,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  submissionId: string;
}): Q.Promise<{}> => {
  const id = `${userId}~${courseId}~${itemId}~${submissionId}`;
  const uri = new URI().addQueryParam('action', 'upvote').addQueryParam('id', id);

  return Q(onDemandPeerSubmissionsApi.post(uri.toString()));
};

export const cancelUpvote = ({
  userId,
  courseId,
  itemId,
  submissionId,
}: {
  userId: number;
  courseId: string;
  itemId: string;
  submissionId: string;
}): Q.Promise<{}> => {
  const id = `${userId}~${courseId}~${itemId}~${submissionId}`;
  const uri = new URI().addQueryParam('action', 'cancelUpvote').addQueryParam('id', id);

  return Q(onDemandPeerSubmissionsApi.post(uri.toString()));
};
