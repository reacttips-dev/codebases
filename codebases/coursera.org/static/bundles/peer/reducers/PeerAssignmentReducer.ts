import { Assignment } from 'bundles/peer/types/Assignment';
import { SubmissionSchema } from 'bundles/assess-common/types/NaptimeSubmissionSchema';

import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';
import { convertSubmissionSchema } from 'bundles/peer/utils/convertLegacyPeerToNaptime';

type LoadingState = 'loading' | 'loaded';

type State = {
  assignment?: Assignment | null;
  naptimeSubmissionSchema?: SubmissionSchema | null;
  loadedItemId?: string | null;
  loadState: LoadingState;
};

export type PeerAssignmentStore = {
  getState(): State;
};

const initialState: State = {
  loadState: 'loading' as LoadingState,
  loadedItemId: undefined,
  assignment: undefined,
  naptimeSubmissionSchema: undefined,
};

function peerAssignment(
  state: State = initialState,
  action: {
    type: typeof ActionNames.LOADING_PEER_ASSIGNMENT | typeof ActionNames.LOADED_PEER_ASSIGNMENT;
    assignment: Assignment;
    loadedItemId: string;
  }
) {
  switch (action.type) {
    case ActionNames.LOADING_PEER_ASSIGNMENT:
      return {
        ...initialState,
      };
    case ActionNames.LOADED_PEER_ASSIGNMENT:
      return {
        ...state,
        assignment: action.assignment,
        naptimeSubmissionSchema: convertSubmissionSchema(action.assignment.submissionSchema),
        loadedItemId: action.loadedItemId,
        loadState: 'loaded' as LoadingState,
      };
    default:
      return state;
  }
}

export const store = createStoreFromReducer<State, Parameters<typeof peerAssignment>[1]>(
  peerAssignment,
  'PeerAssignmentStore',
  [ActionNames.LOADED_PEER_ASSIGNMENT, ActionNames.LOADING_PEER_ASSIGNMENT],
  initialState
);

export const reducer = peerAssignment;
