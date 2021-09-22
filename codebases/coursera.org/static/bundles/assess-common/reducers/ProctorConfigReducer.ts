import { ProctorConfigSummary } from 'bundles/assess-common/types/ProctorConfigSummary';
import createStoreFromReducer from 'js/lib/create-store-from-reducer';
import { ActionNames } from 'bundles/assess-common/constants/ProctorConfigActionNames';

export type State =
  | {
      loadState: 'loading';
    }
  | {
      loadState: 'loaded';
      proctorConfigId: string;
      userId: string;
      proctorConfigSummary: ProctorConfigSummary;
    };

type Action =
  | {
      type: typeof ActionNames.LOADING_PROCTOR_CONFIG;
    }
  | {
      type: typeof ActionNames.LOADED_PROCTOR_CONFIG;
      proctorConfigId: string;
      userId: string;
      proctorConfigSummary: ProctorConfigSummary;
    };

const initialState = {
  loadState: 'loading' as const,
};

function ProctorConfig(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ActionNames.LOADING_PROCTOR_CONFIG:
      return initialState;
    case ActionNames.LOADED_PROCTOR_CONFIG:
      return {
        loadState: 'loaded',
        proctorConfigId: action.proctorConfigId,
        userId: action.userId,
        proctorConfigSummary: action.proctorConfigSummary,
      };
    default:
      return state;
  }
}

export const store = createStoreFromReducer<State, Action>(
  ProctorConfig,
  'ProctorConfigStore',
  [ActionNames.LOADING_PROCTOR_CONFIG, ActionNames.LOADED_PROCTOR_CONFIG],
  initialState
);

export const reducer = ProctorConfig;
