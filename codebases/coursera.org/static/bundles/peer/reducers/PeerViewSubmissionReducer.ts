import type { PublicSubmissionAndRelated } from 'bundles/peer/types/Submission';
import type { ReviewsResponse, ReviewSubmissionState } from 'bundles/peer/types/Reviews';
import type { Submission as NaptimeSubmission } from 'bundles/assess-common/types/NaptimeSubmission';
import type { SubmissionSchema as NaptimeSubmissionSchema } from 'bundles/assess-common/types/NaptimeSubmissionSchema';

import _ from 'underscore';

import type { ReducerStore } from 'js/lib/create-store-from-reducer';
import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';
import { convertSubmission, convertSubmissionSchema } from 'bundles/peer/utils/convertLegacyPeerToNaptime';

import reviewSubmissionReducer from 'bundles/peer/reducers/ReviewSubmissionReducer';

export type LoadState = 'none' | 'loading' | 'loaded' | 'loadError';
export type FlagSubmissionState = 'none' | 'flagging' | 'flagged' | 'flagError';

export type State = {
  itemId?: string;
  submissionId?: string;
  loadState: LoadState;
  submissionAndRelated?: PublicSubmissionAndRelated;
  naptimeSubmission?: NaptimeSubmission;
  naptimeSubmissionSchema?: NaptimeSubmissionSchema;
  reviewSubmissionState?: ReviewSubmissionState | null;
  flaggedPreviousSubmission: boolean;
  flagSubmissionState: FlagSubmissionState;
  flagSubmissionError?: any;
  isOwnSubmission?: boolean;

  // used to hydrate the review submission state for SSR, since it uses some backbone models that are not SSR-able.
  hydrationData?: {
    reviewsResponse: ReviewsResponse;
    viewerId: number;
  };
};

/*
 * This model is identical to the State, except it does not include the ReviewSubmissionState, because that model has
 * backbone models that cannot be dehydrated.
 */
type DehydratedState = {
  itemId?: string;
  submissionId?: string;
  loadState: LoadState;
  submissionAndRelated?: PublicSubmissionAndRelated;
  // naptimeSubmission ~= submissionAndRelated.submission, just in a different format
  // naptimeSubmissionSchema ~= submissionAndRelated.submissionSchema, just in a different format
  naptimeSubmission?: NaptimeSubmission;
  naptimeSubmissionSchema?: NaptimeSubmissionSchema;
  flaggedPreviousSubmission: boolean;
  flagSubmissionState: FlagSubmissionState;
  flagSubmissionError?: any;
  isOwnSubmission?: boolean;

  hydrationData?: {
    reviewsResponse: ReviewsResponse;
    viewerId: number;
  };
};

type Action =
  | {
      type:
        | typeof ActionNames.REVIEW_SUBMISSION_LOCAL_UPDATE_REVIEW
        | typeof ActionNames.REVIEW_SUBMISSION_SUBMITTING
        | typeof ActionNames.REVIEW_SUBMISSION_SUBMIT_ERROR
        | typeof ActionNames.REVIEW_SUBMISSION_SUBMITTED;
      submissionId?: string;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR;
      submissionId?: string;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_LOADED;
      submissionId: string;
      submissionAndRelated: PublicSubmissionAndRelated;
      reviewsResponse: ReviewsResponse;
      viewerId: number;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_LOAD_RESET;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_FLAGGING;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_FLAGGED;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_FLAG_ERROR;
      flagSubmissionError?: any;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_LOCAL_LIKE_SUBMISSION;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_LOCAL_UNDO_LIKE_SUBMISSION;
    }
  | {
      type: typeof ActionNames.PEER_VIEW_SUBMISSION_LOADING;
      itemId: string;
      submissionId: string;
    };

/**
 * Manages state for viewing and reviewing others' submissions.
 */

const initialState: State = {
  itemId: undefined,
  // The id of the submission you are viewing.
  submissionId: undefined,

  // 'none', 'loading', 'loaded', or 'loadError'
  loadState: 'none' as const,

  // The response from the "getSubmission" api.
  submissionAndRelated: undefined,

  // generated from submissionAndRelated
  naptimeSubmission: undefined,
  naptimeSubmissionSchema: undefined,

  // Your current reviewing state on the submission.
  reviewSubmissionState: undefined,

  flaggedPreviousSubmission: false,
  flagSubmissionState: 'none' as const,
  flagSubmissionError: null,
  isOwnSubmission: undefined,

  hydrationData: undefined,
};

const peerViewSubmissionReducer = (myReviewSubmissionReducer: typeof reviewSubmissionReducer) => (
  state: State = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionNames.PEER_VIEW_SUBMISSION_LOAD_RESET:
      return initialState;

    case ActionNames.PEER_VIEW_SUBMISSION_LOADING:
      return {
        ...initialState,
        flaggedPreviousSubmission: state.flaggedPreviousSubmission,
        itemId: action.itemId,
        submissionId: action.submissionId,
        loadState: 'loading' as const,
      };

    case ActionNames.PEER_VIEW_SUBMISSION_LOADED:
      if (action.submissionId === state.submissionId && state.loadState === 'loading') {
        return {
          ...state,
          loadState: 'loaded' as const,
          submissionAndRelated: action.submissionAndRelated,
          naptimeSubmission: convertSubmission(action.submissionAndRelated.submission),
          naptimeSubmissionSchema: convertSubmissionSchema(action.submissionAndRelated.submissionSchema),
          reviewSubmissionState: myReviewSubmissionReducer(undefined, {
            type: ActionNames.REVIEW_SUBMISSION_INITIALIZE,
            reviewSchema: action.submissionAndRelated.reviewSchema,
            reviewsResponse: action.reviewsResponse,
            viewerId: action.viewerId,
            votes: action.submissionAndRelated.votes,
          }),
          hydrationData: {
            reviewsResponse: action.reviewsResponse,
            viewerId: action.viewerId,
          },
          isOwnSubmission: action.viewerId === action.submissionAndRelated.submission.creatorId,
        };
      } else {
        return state;
      }

    case ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR:
      if (action.submissionId === state.submissionId && state.loadState === 'loading') {
        return {
          ...state,
          loadState: 'loadError' as const,
        };
      } else {
        return state;
      }

    case ActionNames.PEER_VIEW_SUBMISSION_FLAGGING:
      return {
        ...state,
        flagSubmissionState: 'flagging' as const,
        flagSubmissionError: undefined,
      };

    case ActionNames.PEER_VIEW_SUBMISSION_FLAGGED:
      return {
        ...state,
        flagSubmissionState: 'flagged' as const,
        flaggedPreviousSubmission: true,
      };

    case ActionNames.PEER_VIEW_SUBMISSION_FLAG_ERROR:
      return {
        ...state,
        flagSubmissionState: 'flagError' as const,
        flagSubmissionError: action.flagSubmissionError,
      };

    case ActionNames.PEER_VIEW_SUBMISSION_LOCAL_LIKE_SUBMISSION:
      if (state.submissionAndRelated == null) {
        return state;
      } else {
        const { submissionAndRelated } = state;
        return {
          ...state,
          submissionAndRelated: Object.assign({}, submissionAndRelated, {
            votes: {
              isUpvotedByUser: !submissionAndRelated.votes.isUpvotedByUser,
              upVotes: submissionAndRelated.votes.upVotes + 1,
            },
          }),
        };
      }

    case ActionNames.PEER_VIEW_SUBMISSION_LOCAL_UNDO_LIKE_SUBMISSION:
      if (state.submissionAndRelated == null) {
        return state;
      } else {
        const { submissionAndRelated } = state;
        return {
          ...state,
          submissionAndRelated: Object.assign({}, submissionAndRelated, {
            votes: {
              isUpvotedByUser: !submissionAndRelated.votes.isUpvotedByUser,
              upVotes: submissionAndRelated.votes.upVotes - 1,
            },
          }),
        };
      }

    case ActionNames.REVIEW_SUBMISSION_LOCAL_UPDATE_REVIEW:
    case ActionNames.REVIEW_SUBMISSION_SUBMITTING:
    case ActionNames.REVIEW_SUBMISSION_SUBMIT_ERROR:
    case ActionNames.REVIEW_SUBMISSION_SUBMITTED:
      if (action.submissionId === state.submissionId && state.loadState === 'loaded' && state.reviewSubmissionState) {
        let { flaggedPreviousSubmission } = state;
        // If we are submitting, reset whether the previous submission has been flagged.
        if (action.type === ActionNames.REVIEW_SUBMISSION_SUBMITTING) {
          flaggedPreviousSubmission = false;
        }

        return {
          ...state,
          flaggedPreviousSubmission,
          // @ts-expect-error TSMIGRATION
          reviewSubmissionState: myReviewSubmissionReducer(state.reviewSubmissionState, action),
        };
      } else {
        return state;
      }

    default:
      return state;
  }
};

export const store = createStoreFromReducer<State, Action>(
  peerViewSubmissionReducer(reviewSubmissionReducer),
  'PeerViewSubmissionStore',
  [
    ActionNames.PEER_VIEW_SUBMISSION_LOAD_RESET,
    ActionNames.PEER_VIEW_SUBMISSION_LOADING,
    ActionNames.PEER_VIEW_SUBMISSION_LOADED,
    ActionNames.PEER_VIEW_SUBMISSION_LOAD_ERROR,

    ActionNames.PEER_VIEW_SUBMISSION_LOCAL_LIKE_SUBMISSION,
    ActionNames.PEER_VIEW_SUBMISSION_LOCAL_UNDO_LIKE_SUBMISSION,

    ActionNames.PEER_VIEW_SUBMISSION_FLAGGING,
    ActionNames.PEER_VIEW_SUBMISSION_FLAGGED,
    ActionNames.PEER_VIEW_SUBMISSION_FLAG_ERROR,

    ActionNames.REVIEW_SUBMISSION_LOCAL_UPDATE_REVIEW,
    ActionNames.REVIEW_SUBMISSION_SUBMITTING,
    ActionNames.REVIEW_SUBMISSION_SUBMIT_ERROR,
    ActionNames.REVIEW_SUBMISSION_SUBMITTED,
  ],
  initialState,
  {
    dehydrate(this: ReducerStore<State>): DehydratedState {
      const state: State = Object.assign({}, this.getState());

      return _.omit(state, 'reviewSubmissionState');
    },

    rehydrate(this: ReducerStore<State>, dehydratedState: DehydratedState) {
      const state: State = {
        ...dehydratedState,
        reviewSubmissionState:
          dehydratedState.hydrationData &&
          reviewSubmissionReducer(undefined, {
            type: ActionNames.REVIEW_SUBMISSION_INITIALIZE,
            reviewSchema: dehydratedState.submissionAndRelated && dehydratedState.submissionAndRelated.reviewSchema,
            reviewsResponse: dehydratedState.hydrationData && dehydratedState.hydrationData.reviewsResponse,
            viewerId: dehydratedState.hydrationData && dehydratedState.hydrationData.viewerId,
            votes: dehydratedState.submissionAndRelated && dehydratedState.submissionAndRelated.votes,
          }),
      };

      this.state = state;
    },
  }
);

export const reducer = peerViewSubmissionReducer;
