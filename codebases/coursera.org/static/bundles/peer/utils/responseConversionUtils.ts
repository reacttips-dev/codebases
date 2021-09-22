/*
 * Typed conversion utility functions for converting from naptime responses to the old peer types.
 */

import type {
  PublicSubmissionAndRelated,
  OwnSubmissionAndRelated,
  Submission as LegacySubmission,
} from 'bundles/peer/types/Submission';
import type {
  SubmissionResponse,
  SubmissionDraftResponse,
  RawSubmissionDraftResponse,
} from 'bundles/peer/types/NaptimeSubmission';
import type { Instructions } from 'bundles/peer/types/NaptimeAssignment';
import type { SubmissionSchemaLinked } from 'bundles/assess-common/types/NaptimeSubmissionSchema';
import type { ReviewSchema as LegacyReviewSchema } from 'bundles/peer/types/Reviews';
import type { ReviewSchemaLinked } from 'bundles/peer/types/NaptimeReviewSchema';
import type { ValidationError as ErrorTreeValidationError } from 'bundles/peer/types/ErrorTree';
import type { Assignment as LegacyAssignment } from 'bundles/peer/types/Assignment';
import type { PeerAssignmentApiResponse } from 'bundles/peer/api/peerAssignmentApi';
import type {
  LegacyReviewQueueResponse,
  LegacyReviewedSubmissionsResponse,
} from 'bundles/peer/types/SubmissionSummary';
import type { OnDemandPeerQueuedSubmissionSummariesV1Response as NaptimeReviewQueueResponse } from 'bundles/peer/api/onDemandPeerQueuedSubmissionSummariesApi';
import type { OnDemandPeerAuthoredReviewSummariesV1Response as NaptimeAuthoredReviewSummariesResponse } from 'bundles/peer/api/onDemandPeerAuthoredReviewSummariesApi';
import type { SocialProfile } from 'bundles/assess-common/types/SocialProfile';

import _ from 'underscore';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isURL } from 'validator';

import initializeSubmissionFromSchema from 'bundles/peer/utils/initializeSubmissionFromSchema';
import {
  naptimeReviewSchemaToLegacy,
  naptimeSubmissionSchemaToLegacy,
} from 'bundles/peer/utils/convertNaptimeToLegacyPeer';
import type { ValidationError } from 'bundles/assess-common/types/ValidationErrors';

const unsubmittedOwnSubmissionDraftDefaults = {
  isSubmitted: false,
  // unsubmitted peer reviews do not have votes.
  votes: {
    upVotes: 0,
    isUpvotedByUser: false,
  },
  // unsubmitted peer reviews have not been deleted.
  isLatestDeletedSubmissionDeletedByAdmin: false,
};

const validationErrorToErrorTree = (error: ValidationError, blocksSubmit: boolean): ErrorTreeValidationError => {
  return {
    errorType: error.reason.typeName === 'generic' ? 'SanitizationError' : 'InvalidField',
    errorMessage: error.debugMessage,
    blocksSubmit,
  };
};

export const initializeOwnSubmissionFromNaptimeSchema = (
  naptimeSubmissionSchema: SubmissionSchemaLinked,
  naptimeReviewSchema: ReviewSchemaLinked | null,
  userId: number
): OwnSubmissionAndRelated => {
  const attachedAssignmentId = naptimeSubmissionSchema.id.split('~')[3];
  const versionNumber = parseInt(attachedAssignmentId.split('@')[1], 10);
  const submissionSchema = naptimeSubmissionSchemaToLegacy(naptimeSubmissionSchema.submissionSchema, versionNumber);
  const submission = initializeSubmissionFromSchema(submissionSchema, userId);
  submission.versionedAssignmentId = attachedAssignmentId;

  let reviewSchema;
  if (naptimeReviewSchema != null) {
    reviewSchema = naptimeReviewSchemaToLegacy(naptimeReviewSchema.reviewSchema);
  }

  return Object.assign({}, unsubmittedOwnSubmissionDraftDefaults, {
    isSaved: false,
    submission,
    submissionSchema,
    reviewSchema,
    errorTree: { children: {}, errors: [] },
  });
};

export const convertRawSubmissionDraft = (draft: RawSubmissionDraftResponse): LegacySubmission => {
  return {
    typeName: 'multipart',
    definition: {
      // @ts-expect-error TSMIGRATION
      title: draft.submission.title,
      parts: draft.submission.parts,
    },
    isDraft: true,
    isLate: false,
    id: draft.id.split('~')[3],
    creatorId: draft.creatorId,
    createdAt: draft.createdAt,
    isMentorGraded: false,

    // these are not currently used but could be in the future.
    context: draft.context,
    assignmentId: draft.attachedAssignmentId.split('@')[0],
    versionedAssignmentId: draft.attachedAssignmentId,
  };
};

export const convertNaptimeSubmissionDraftToOwnSubmission = (
  draft: SubmissionDraftResponse
): OwnSubmissionAndRelated => {
  const naptimeSubmissionSchema = draft.submissionSchema;
  const versionNumber = parseInt(draft.attachedAssignmentId.split('@')[1], 10);
  const submissionSchema = naptimeSubmissionSchemaToLegacy(naptimeSubmissionSchema.submissionSchema, versionNumber);

  let reviewSchema: LegacyReviewSchema | undefined;
  if (draft.reviewSchema) {
    reviewSchema = naptimeReviewSchemaToLegacy(draft.reviewSchema.reviewSchema);
  }

  const submission = {
    typeName: 'multipart',
    definition: {
      title: draft.submission.title,
      parts: draft.submission.parts,
    },
    isDraft: true,
    isLate: false,
    id: draft.id.split('~')[3],
    creatorId: draft.creatorId,
    createdAt: draft.createdAt,
    isMentorGraded: false,

    // these are not currently used but could be in the future.
    context: draft.context,
    assignmentId: draft.attachedAssignmentId.split('@')[0],
    versionedAssignmentId: draft.attachedAssignmentId,
  };

  // @ts-expect-error TSMIGRATION
  return Object.assign({}, unsubmittedOwnSubmissionDraftDefaults, {
    isSaved: true,
    submission,
    submissionSchema,
    upgradeToCurrentAssignment: draft.upgradeSubmissionToLatestAssignment
      ? {
          severity: draft.upgradeSubmissionToLatestAssignment.severity,
          // TODO (dwinegar) add these?
          reviewSchemaChanges: [],
          submissionSchemaChanges: [],
          upgradeToVersion: parseInt(draft.upgradeSubmissionToLatestAssignment.latestAssignmentId.split('@')[1], 10),
        }
      : null,

    reviewSchema,

    errorTree: {
      errors:
        draft.validationErrors.title != null
          ? [validationErrorToErrorTree(draft.validationErrors.title, draft.blocksSubmit)]
          : [],
      children: _.object(
        naptimeSubmissionSchema.submissionSchema.parts.map((part) => part.id),
        naptimeSubmissionSchema.submissionSchema.parts.map((part) => {
          const submissionPart = draft.submission.parts[part.id];
          if (draft.validationErrors.partsSummary[part.id]) {
            return {
              errors: [validationErrorToErrorTree(draft.validationErrors.partsSummary[part.id], draft.blocksSubmit)],
              children: {},
            };
          }

          // Validate URL type on the frontend
          if (
            submissionPart.typeName === 'url' &&
            !!submissionPart?.definition?.url &&
            !isURL(submissionPart?.definition?.url)
          ) {
            return {
              errors: [
                validationErrorToErrorTree(
                  {
                    reason: {
                      typeName: 'invalidUrl',
                      definition: {},
                    },
                    // adding a dot for consistency with error message returned from the backend
                    debugMessage: 'Invalid URL.',
                  },
                  true
                ),
              ],
              children: {},
            };
          }

          return {
            children: {},
            errors: [],
          };
        })
      ),
    },
  });
};

export const convertNaptimeAssignment = (assignmentApiResponse: PeerAssignmentApiResponse): LegacyAssignment => {
  // @ts-expect-error TSMIGRATION
  const instructions: Instructions = _(assignmentApiResponse.elements).first();
  // @ts-expect-error TSMIGRATION
  const gradingMetadata: GradingMetadata = _(
    assignmentApiResponse.linked['onDemandPeerAssignmentGradingMetadata.v1']
  ).first();
  // @ts-expect-error TSMIGRATION
  const reviewSchema: ReviewSchemaLinked = _(assignmentApiResponse.linked['onDemandPeerReviewSchemas.v1']).first();
  const submissionSchema = _(assignmentApiResponse.linked['onDemandPeerSubmissionSchemas.v1']).first();

  let definition;
  let reviewCutoffs;
  switch (gradingMetadata.assignmentDetails.typeName) {
    case 'standard':
      definition = {}; // intentionally empty
      break;
    case 'closed':
      definition = {
        learningObjectives: [], // unused field
        passingFraction: gradingMetadata.assignmentDetails.definition.passingFraction,
        closureType: gradingMetadata.assignmentDetails.definition.closureType,
      };
      reviewCutoffs = gradingMetadata.assignmentDetails.definition.receivedReviewCutoffs;
      break;
    default:
      definition = {
        learningObjectives: [], // unused field
        passingFraction: gradingMetadata.assignmentDetails.definition.passingFraction,
      };
      reviewCutoffs = gradingMetadata.assignmentDetails.definition.receivedReviewCutoffs;
      break;
  }

  // @ts-expect-error TSMIGRATION
  const attachedAssignmentId = submissionSchema.id.split('~')[3];
  const versionNumber = parseInt(attachedAssignmentId.split('@')[1], 10);
  return {
    instructions: instructions.instructions,
    reviewSchema: reviewSchema && naptimeReviewSchemaToLegacy(reviewSchema.reviewSchema),
    // @ts-expect-error TSMIGRATION
    submissionSchema: naptimeSubmissionSchemaToLegacy(submissionSchema.submissionSchema, versionNumber),
    // @ts-expect-error TSMIGRATION
    commentSchema: null, // unused field
    definition,
    typeName: gradingMetadata.assignmentDetails.typeName,
    isMentorGraded: gradingMetadata.isMentorGraded,
    requiredReviewCount: gradingMetadata.requiredAuthoredReviewCount,
    reviewCutoffs,
  };
};

export const convertNaptimeReviewQueue = (response: NaptimeReviewQueueResponse): LegacyReviewQueueResponse => {
  return {
    // @ts-expect-error TSMIGRATION
    submissionSummaries: _(response.elements).map((element) => {
      return Object.assign({}, element.submissionSummary.summary, element.submissionSummary.computed, {
        reviewTargetReached: element.reviewingComplete,
      });
    }),
    userProfiles: _(response.linked['onDemandSocialProfiles.v1']).map((profile) => {
      return _(profile).omit('id');
    }),
  };
};

export const convertNaptimeReviewedSubmissions = (
  response: NaptimeAuthoredReviewSummariesResponse
): LegacyReviewedSubmissionsResponse => {
  const submissionSummaries = _(response.linked['onDemandPeerSubmissionSummaries.v2']).map((summary) => {
    return Object.assign({}, summary.summary, summary.computed);
  });

  const userProfiles = _(response.linked['onDemandSocialProfiles.v1']).map((profile: SocialProfile) => {
    return _(profile).omit('id');
  });

  const reviews = _(response.elements).map((element) => {
    return {
      creatorId: element.creatorId,
      createdAt: element.createdAt,
      id: element.id.split('~')[3],
    };
  });

  return {
    // @ts-expect-error TSMIGRATION
    submissionSummaries,
    userProfiles,
    reviews,
  };
};

export const convertNaptimeSubmissionToPublicSubmission = (
  naptimeSubmission: SubmissionResponse
): PublicSubmissionAndRelated => {
  const naptimeSubmissionSchema = naptimeSubmission.submissionSchema;
  const versionNumber = parseInt(naptimeSubmission.attachedAssignmentId.split('@')[1], 10);
  const submissionSchema = naptimeSubmissionSchemaToLegacy(naptimeSubmissionSchema.submissionSchema, versionNumber);

  let reviewSchema: LegacyReviewSchema | undefined;
  if (naptimeSubmission.reviewSchema) {
    reviewSchema = naptimeReviewSchemaToLegacy(naptimeSubmission.reviewSchema.reviewSchema);
  }

  const submission = {
    typeName: 'multipart',
    definition: {
      title: naptimeSubmission.submission.title || '',
      parts: naptimeSubmission.submission.parts,
    },
    isDraft: false,
    isDeleted: naptimeSubmission.isDeleted || false,
    isLate: naptimeSubmission.isLate || false,
    isAnonymous: naptimeSubmission.isAnonymous || false,
    id: naptimeSubmission.id.split('~')[3],
    creatorId: naptimeSubmission.creatorId,
    createdAt: naptimeSubmission.createdAt,
    isMentorGraded: false,

    // these are not currently used but could be in the future.
    context: naptimeSubmission.context,
    assignmentId: naptimeSubmission.attachedAssignmentId.split('@')[0],
    versionedAssignmentId: naptimeSubmission.attachedAssignmentId,
  };

  return {
    submission,
    submissionSchema,
    reviewSchema,
    isDeleted: naptimeSubmission.isDeleted || false,
    votes: {
      upVotes: naptimeSubmission.upvotes,
      isUpvotedByUser: naptimeSubmission.isUpvotedByRequester,
    },
    isLatestDeletedSubmissionDeletedByAdmin: naptimeSubmission.isLatestDeletedSubmissionDeletedByAdmin,
    userProfiles: naptimeSubmission.socialProfiles || [],
  };
};
