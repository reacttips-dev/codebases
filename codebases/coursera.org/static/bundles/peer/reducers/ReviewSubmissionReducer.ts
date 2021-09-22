import { PublicSubmissionAndRelated, SubmissionVotes } from 'bundles/peer/types/Submission';
import {
  ReviewSubmissionState,
  ReviewsResponse,
  ReviewSchema,
  ReviewErrorType,
  SubmitState,
} from 'bundles/peer/types/Reviews';
import { ReviewPartDefinitions } from 'bundles/assess-common/types/Reviews';

import { ReviewValidationErrors } from 'bundles/assess-common/types/ValidationErrors';

import _ from 'underscore';

import { ActionNames } from 'bundles/peer/actions/constants';
import initializeReviewFromSchema from 'bundles/peer/utils/initializeReviewFromSchema';
import initializeBackboneReviews from 'bundles/peer/utils/initializeBackboneReviews';

import reviewSchemaFactory from 'pages/open-course/peerReview/reviewTypes/factories/schemaFactory';

type Action =
  | {
      type: typeof ActionNames.REVIEW_SUBMISSION_INITIALIZE;
      reviewSchema?: ReviewSchema;
      submissionAndRelated?: PublicSubmissionAndRelated;
      viewerId: number;
      reviewsResponse: ReviewsResponse;
      votes?: SubmissionVotes;
    }
  | {
      type: typeof ActionNames.REVIEW_SUBMISSION_LOCAL_UPDATE_REVIEW;
      change: ReviewPartDefinitions;
      reviewSchemaPartId: string;
    }
  | {
      type: typeof ActionNames.REVIEW_SUBMISSION_SUBMIT_ERROR;
      errorType: ReviewErrorType;
      reviewValidationErrors?: ReviewValidationErrors;
    }
  | {
      type: typeof ActionNames.REVIEW_SUBMISSION_SUBMITTING;
    }
  | {
      type: typeof ActionNames.REVIEW_SUBMISSION_SUBMITTED;
    };

const initialState = {
  backboneReviewSchema: null,
  review: null,
  reviews: null,
  backboneReviews: [],
  submitState: 'notSubmitted' as SubmitState,
  errorType: null,
  reviewValidationErrors: undefined,
};

function reviewSubmissionReducer(
  state: ReviewSubmissionState = initialState,
  action: Action
): ReviewSubmissionState | null {
  switch (action.type) {
    case ActionNames.REVIEW_SUBMISSION_INITIALIZE:
      const { reviewSchema, reviewsResponse, viewerId } = action;
      const backboneReviewSchema = reviewSchemaFactory(reviewSchema);
      const viewerReview = _(reviewsResponse.reviews).find((review) => review.creatorId === viewerId);

      return {
        backboneReviewSchema,
        // this review is the user review.
        // @ts-expect-error TSMIGRATION-3.9
        review: (viewerReview && viewerReview.definition) || initializeReviewFromSchema(reviewSchema),
        // this 'reviews' model is the unhydrated backend reviews model (see flow type).
        reviews: reviewsResponse,
        // this 'reviews' is an array of wrapped backbone review models (see flow type).
        backboneReviews: initializeBackboneReviews({
          reviews: reviewsResponse.reviews,
          userProfiles: reviewsResponse.userProfiles,
        }),
        submitState: viewerReview ? 'submitted' : 'notSubmitted',
        errorType: null,
        reviewValidationErrors: null,
      };

    case ActionNames.REVIEW_SUBMISSION_LOCAL_UPDATE_REVIEW:
      const { review } = state;
      const { change, reviewSchemaPartId } = action;

      if (review == null) {
        return state;
      }

      const newReview = {
        ...review,
        // @ts-expect-error TSMIGRATION
        parts: _(review.parts).mapObject((part, partId) => {
          if (partId === reviewSchemaPartId) {
            return {
              ...part,
              definition: {
                ...part.definition,
                ...change,
              },
            };
          } else {
            return part;
          }
        }),
      };
      return {
        ...state,
        review: newReview,
      };

    case ActionNames.REVIEW_SUBMISSION_SUBMITTING:
      return {
        ...state,
        submitState: 'submitting',
        errorType: null,
        errorTree: null,
      };

    case ActionNames.REVIEW_SUBMISSION_SUBMIT_ERROR:
      return {
        ...state,
        submitState: 'submitError',
        errorType: action.errorType,
        reviewValidationErrors: action.reviewValidationErrors,
      };

    case ActionNames.REVIEW_SUBMISSION_SUBMITTED:
      return {
        ...state,
        submitState: 'submitted',
        errorType: null,
        errorTree: null,
      };

    default:
      return state;
  }
}

export default reviewSubmissionReducer;
