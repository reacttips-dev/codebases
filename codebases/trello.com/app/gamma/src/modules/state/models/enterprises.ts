/* eslint-disable import/no-default-export */
import { normalizeEnterprise } from 'app/gamma/src/api/normalizers/enterprise';
import {
  LOAD_HEADER_SUCCESS,
  LoadHeaderSuccessAction,
} from 'app/gamma/src/modules/loaders/load-header';
import { EnterpriseResponse } from 'app/gamma/src/types/responses';
import { EnterpriseModel } from 'app/gamma/src/types/models';
import { Action, actionCreator, createReducer } from '@trello/redux';

export const UPDATE_ENTERPRISE = Symbol('models/UPDATE_ENTERPRISE');

type UpdateEnterpriseAction = Action<
  typeof UPDATE_ENTERPRISE,
  EnterpriseResponse
>;

export const updateEnterpriseAction = actionCreator<UpdateEnterpriseAction>(
  UPDATE_ENTERPRISE,
);

export interface EnterpriseState {
  isLoading: boolean;
  collection: {
    [idEnterprise: string]: EnterpriseModel;
  };
}

const initialState: EnterpriseState = {
  isLoading: false,
  collection: {},
};

const upsertEnterprise = (
  state: EnterpriseState,
  enterprise: EnterpriseResponse,
) => ({
  ...state,
  collection: {
    ...state.collection,
    [enterprise.id]: {
      ...(state.collection[enterprise.id] || {}),
      ...normalizeEnterprise(enterprise),
    },
  },
});

export default createReducer(initialState, {
  [LOAD_HEADER_SUCCESS](state, { payload }: LoadHeaderSuccessAction) {
    if (!payload.enterprises) {
      return state;
    }

    return payload.enterprises.reduce(
      (result, enterprise) => upsertEnterprise(result, enterprise),
      state,
    );
  },

  [UPDATE_ENTERPRISE](state, { payload }: UpdateEnterpriseAction) {
    if (!payload) {
      return state;
    }

    return upsertEnterprise(state, payload);
  },
});
