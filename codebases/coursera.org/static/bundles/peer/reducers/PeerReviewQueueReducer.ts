import { QueueSubmissions } from 'bundles/peer/types/Submission';

import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';

export type LoadState = 'none' | 'loading' | 'loaded' | 'loadError';
export type ErrorReasons = 'mustSubmitBeforeReviewing';

export type PeerReviewQueueState = {
  submissions?: QueueSubmissions | null;
  itemId?: string | null;
  loaded: boolean;
  loadState: LoadState;
  errorType?: ErrorReasons | null;
};

type Action =
  | {
      type: typeof ActionNames.REVIEW_QUEUE_LOADING;
    }
  | {
      type: typeof ActionNames.REVIEW_QUEUE_LOADED;
      data: QueueSubmissions;
      itemId: string;
    }
  | {
      type: typeof ActionNames.REVIEW_QUEUE_ERROR;
      errorType: ErrorReasons;
    };

const initialState = {
  submissions: null,
  itemId: null,
  loaded: false,
  loadState: 'none' as LoadState,
  errorType: null,
};

function peerReviewQueue(state: PeerReviewQueueState = initialState, action: Action) {
  switch (action.type) {
    case ActionNames.REVIEW_QUEUE_LOADING: {
      return {
        ...state,
        submissions: null,
        itemId: null,
        loaded: false,
        loadState: 'loading' as const,
      };
    }
    case ActionNames.REVIEW_QUEUE_LOADED: {
      return {
        ...state,
        submissions: action.data,
        itemId: action.itemId,
        loaded: true,
        loadState: 'loaded' as const,
      };
    }
    case ActionNames.REVIEW_QUEUE_ERROR: {
      return {
        ...state,
        loaded: true,
        loadState: 'loadError' as const,
        errorType: action.errorType,
      };
    }
    default:
      return state;
  }
}

export const store = createStoreFromReducer<PeerReviewQueueState, Action>(
  peerReviewQueue,
  'PeerReviewQueueStore',
  [ActionNames.REVIEW_QUEUE_LOADING, ActionNames.REVIEW_QUEUE_LOADED, ActionNames.REVIEW_QUEUE_ERROR],
  initialState
);

export const reducer = peerReviewQueue;
