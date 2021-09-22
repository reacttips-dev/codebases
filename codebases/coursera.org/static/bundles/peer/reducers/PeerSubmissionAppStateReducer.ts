import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/peer/actions/constants';
import _t from 'i18n!nls/peer';

import { SubmissionAppState } from 'bundles/assess-common/types/SubmissionAppState';

function convertErrorCodeToMessage(code?: number): string {
  const CODE_TO_ERROR_MESSAGE = {
    '413': _t('Your submission is too large to be saved. Remove some content and try again.'),
  };

  if (code) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return CODE_TO_ERROR_MESSAGE[code.toString()];
  } else {
    return '';
  }
}

type Action =
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_READY;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_SAVE_SUCCESS;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_AUTO_SAVE_SUCCESS;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_SAVING;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_SAVE_ERROR;
      responseJson: any;
      statusCode?: number;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_SUBMIT_SUCCESS;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_SUBMITTING;
    }
  | {
      type: typeof ActionNames.PEER_SUBMISSION_APP_STATE_SUBMIT_ERROR;
      responseJson: any;
      statusCode?: number;
    }
  | {
      type: typeof ActionNames.PEER_SUBMIT_LOCAL_UPDATE_DRAFT_SUBMISSION;
    };

const initialState: SubmissionAppState = {
  saveState: 'ready',
  submitState: 'ready',
  showValidation: false,
  errorMessage: undefined,
};

function peerSubmissionAppStateReducer(state: SubmissionAppState = initialState, action: Action): SubmissionAppState {
  switch (action.type) {
    case ActionNames.PEER_SUBMISSION_APP_STATE_READY:
      return {
        saveState: 'ready',
        submitState: 'ready',
        showValidation: false,
        errorMessage: undefined,
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_SAVE_SUCCESS:
      return {
        ...state,
        saveState: 'ready',
        showValidation: true,
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_AUTO_SAVE_SUCCESS:
      return {
        ...state,
        saveState: 'ready',
        showValidation: false,
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_SAVING:
      return {
        ...state,
        saveState: 'saving',
        submitState: 'ready',
        showValidation: false,
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_SAVE_ERROR:
      return {
        ...state,
        saveState: 'saveError',
        showValidation: true,
        errorMessage: convertErrorCodeToMessage(action.statusCode),
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_SUBMIT_SUCCESS:
      return {
        ...state,
        submitState: 'ready',
        showValidation: true,
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_SUBMITTING:
      return {
        ...state,
        submitState: 'submitting',
        showValidation: false,
      };

    case ActionNames.PEER_SUBMISSION_APP_STATE_SUBMIT_ERROR:
      return {
        ...state,
        submitState: 'submitError',
        showValidation: true,
        errorMessage: convertErrorCodeToMessage(action.statusCode),
      };

    case ActionNames.PEER_SUBMIT_LOCAL_UPDATE_DRAFT_SUBMISSION:
      return state;

    default:
      return state;
  }
}

export const store = createStoreFromReducer(
  peerSubmissionAppStateReducer,
  'PeerSubmissionAppStateStore',
  [
    ActionNames.PEER_SUBMISSION_APP_STATE_READY,

    ActionNames.PEER_SUBMISSION_APP_STATE_SAVING,
    ActionNames.PEER_SUBMISSION_APP_STATE_SAVE_ERROR,
    ActionNames.PEER_SUBMISSION_APP_STATE_SAVE_SUCCESS,
    ActionNames.PEER_SUBMISSION_APP_STATE_AUTO_SAVE_SUCCESS,

    ActionNames.PEER_SUBMISSION_APP_STATE_SUBMITTING,
    ActionNames.PEER_SUBMISSION_APP_STATE_SUBMIT_SUCCESS,
    ActionNames.PEER_SUBMISSION_APP_STATE_SUBMIT_ERROR,

    ActionNames.PEER_SUBMIT_LOCAL_UPDATE_DRAFT_SUBMISSION,
  ],
  initialState
);

export const reducer = peerSubmissionAppStateReducer;
