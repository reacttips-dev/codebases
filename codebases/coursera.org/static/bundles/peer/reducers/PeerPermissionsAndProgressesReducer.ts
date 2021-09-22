import { Capabilities, PermissionWithReason } from 'bundles/peer/types/Permissions';
import {
  ReceivedReviewProgresses,
  SubmissionProgresses,
  PeerPermissionsAndProgresses,
} from 'bundles/peer/types/PeerPermissionsAndProgresses';

import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';

export type LoadingState = 'none' | 'loading' | 'loaded' | 'loadError';

type Actions =
  | {
      type: typeof ActionNames.LOADING_PEER_USER_PERMISSIONS;
    }
  | {
      type: typeof ActionNames.LOADED_PEER_USER_PERMISSIONS;
      capabilities: Array<Capabilities>;
      capabilitiesWithReasons?: PeerPermissionsAndProgresses['assignmentPermissions'];
      receivedReviewProgresses: ReceivedReviewProgresses;
      submissionProgresses: SubmissionProgresses;
    };

export type State = {
  loadState: LoadingState;
  capabilities: Array<Capabilities>;
  capabilitiesWithReasons?: PeerPermissionsAndProgresses['assignmentPermissions'];
  receivedReviewProgresses?: ReceivedReviewProgresses;
  isSubmitted?: boolean;
  submissionProgress?: SubmissionProgresses;
  latestSubmissionId?: string;
};

export type PeerPermissionsAndProgressesStore = {
  getState(): State;
};

const initialState: State = {
  capabilities: [],
  capabilitiesWithReasons: undefined,
  receivedReviewProgresses: undefined,
  loadState: 'none',
  isSubmitted: undefined,
  submissionProgress: undefined,
  latestSubmissionId: undefined,
};

/*
 * Holds data related to user state:
 * Permissions (ex. capabilities like 'viewOthersSubmissions') and progress (ex. reviewProgress)
 */

function peerPermissionsAndProgresses(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case ActionNames.LOADING_PEER_USER_PERMISSIONS:
      return {
        submissionProgress: undefined,
        isSubmitted: undefined,
        capabilities: [],
        capabilitiesWithReasons: undefined,
        receivedReviewProgresses: undefined,
        loadState: 'loading',
        latestSubmissionId: undefined,
      };
    case ActionNames.LOADED_PEER_USER_PERMISSIONS: {
      const maybeLatestSubmissionId =
        action.submissionProgresses &&
        action.submissionProgresses.latestSubmissionSummary &&
        action.submissionProgresses.latestSubmissionSummary.computed.id;
      const maybeLatestDraftId =
        action.submissionProgresses &&
        action.submissionProgresses.latestDraftSummary &&
        action.submissionProgresses.latestDraftSummary.computed.id;
      // if we have a submitted submission, use the submissionId. Else use the draftId. This will be undefined if there
      // is no submitted submission or saved draft.
      const latestSubmissionId = maybeLatestSubmissionId || maybeLatestDraftId;

      return {
        submissionProgress: action.submissionProgresses,
        isSubmitted: !!action.submissionProgresses.latestSubmissionSummary,
        capabilities: action.capabilities,
        capabilitiesWithReasons: action.capabilitiesWithReasons,
        receivedReviewProgresses: action.receivedReviewProgresses,
        loadState: 'loaded',
        latestSubmissionId,
      };
    }
    default:
      return state;
  }
}

export const store = createStoreFromReducer(
  peerPermissionsAndProgresses,
  'PeerPermissionsAndProgressesStore',
  [ActionNames.LOADED_PEER_USER_PERMISSIONS, ActionNames.LOADING_PEER_USER_PERMISSIONS],
  initialState
);

export const reducer = peerPermissionsAndProgresses;
