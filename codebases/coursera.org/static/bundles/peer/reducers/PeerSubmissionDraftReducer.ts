import { Submission as NaptimeSubmission } from 'bundles/assess-common/types/NaptimeSubmission';
import { SubmissionSchema as NaptimeSubmissionSchema } from 'bundles/assess-common/types/NaptimeSubmissionSchema';
import { OwnSubmissionAndRelated, Submission } from 'bundles/peer/types/Submission';

import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';
import { convertSubmission, convertSubmissionSchema } from 'bundles/peer/utils/convertLegacyPeerToNaptime';

type State = {
  loaded: boolean;
  latestSubmissionAndRelated?: OwnSubmissionAndRelated;
  // naptimeSubmission ~= latestSubmissionAndRelated.submission, just in a different format
  // naptimeSubmissionSchema ~= latestSubmissionAndRelated.submissionSchema, just in a different format
  naptimeSubmission?: NaptimeSubmission;
  naptimeSubmissionSchema?: NaptimeSubmissionSchema;
  hasLocalChanges: boolean;
};

type Actions =
  | {
      type: typeof ActionNames.PEER_SUBMISSION_DRAFT_LOADING;
    }
  | {
      type: typeof ActionNames.LOADED_PEER_SUBMISSION_DRAFT;
      latestSubmissionAndRelated: OwnSubmissionAndRelated;
      naptimeSubmission: NaptimeSubmission;
      naptimeSubmissionSchema: NaptimeSubmissionSchema;
    }
  | {
      type: typeof ActionNames.PEER_SUBMIT_LOCAL_UPDATE_DRAFT_SUBMISSION;
      submission: Submission;
    }
  | {
      type: typeof ActionNames.PEER_SUBMIT_UPDATE_LATEST_SUBMISSION_DRAFT;
      latestSubmissionAndRelated: OwnSubmissionAndRelated;
    };

export type PeerSubmissionDraftStore = {
  getState(): () => State;
};

const initialState = {
  loaded: false,
  latestSubmissionAndRelated: undefined,
  naptimeSubmission: undefined,
  naptimeSubmissionSchema: undefined,
  hasLocalChanges: false,
};

function peerSubmissionDraftReducer(state: State = initialState, action: Actions) {
  switch (action.type) {
    case ActionNames.PEER_SUBMISSION_DRAFT_LOADING:
      return {
        loaded: false,
        latestSubmissionAndRelated: undefined,
        naptimeSubmission: undefined,
        naptimeSubmissionSchema: undefined,
        hasLocalChanges: false,
      };

    case ActionNames.LOADED_PEER_SUBMISSION_DRAFT: {
      const { latestSubmissionAndRelated } = action;

      return {
        ...state,
        latestSubmissionAndRelated,
        naptimeSubmission: convertSubmission(latestSubmissionAndRelated.submission),
        naptimeSubmissionSchema: convertSubmissionSchema(latestSubmissionAndRelated.submissionSchema),
        loaded: true,
        hasLocalChanges: false,
      };
    }

    case ActionNames.PEER_SUBMIT_LOCAL_UPDATE_DRAFT_SUBMISSION:
      return {
        ...state,
        latestSubmissionAndRelated: Object.assign({}, state.latestSubmissionAndRelated, {
          submission: action.submission,
        }),
        naptimeSubmission: convertSubmission(action.submission),
        hasLocalChanges: true,
      };

    case ActionNames.PEER_SUBMIT_UPDATE_LATEST_SUBMISSION_DRAFT: {
      // some fields are not on the updated (saved) version of submission, so copy that separately so that we don't blow
      // away fields on the existing submission.

      const stateSubmission =
        state.latestSubmissionAndRelated != null ? state.latestSubmissionAndRelated.submission : {};

      const latestSubmission = Object.assign(
        {},
        stateSubmission,
        action.latestSubmissionAndRelated.submission,
        // update save time
        { createdAt: Date.now() }
      );

      const submissionAndRelated = Object.assign(
        {},
        state.latestSubmissionAndRelated,
        action.latestSubmissionAndRelated,
        { submission: latestSubmission }
      );

      return {
        ...state,
        latestSubmissionAndRelated: submissionAndRelated,
        naptimeSubmission: convertSubmission(latestSubmission),
        naptimeSubmissionSchema: convertSubmissionSchema(action.latestSubmissionAndRelated.submissionSchema),
        hasLocalChanges: false,
      };
    }

    default:
      return state;
  }
}

export const store = createStoreFromReducer<State, Actions>(
  peerSubmissionDraftReducer,
  'PeerSubmissionDraftStore',
  [
    ActionNames.PEER_SUBMISSION_DRAFT_LOADING,
    ActionNames.LOADED_PEER_SUBMISSION_DRAFT,
    ActionNames.PEER_SUBMIT_UPDATE_LATEST_SUBMISSION_DRAFT,
    ActionNames.PEER_SUBMIT_LOCAL_UPDATE_DRAFT_SUBMISSION,
  ],
  initialState
);

export const reducer = peerSubmissionDraftReducer;
