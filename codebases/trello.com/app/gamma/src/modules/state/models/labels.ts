/* eslint-disable import/no-default-export */
import { normalizeLabel } from 'app/gamma/src/api/normalizers/label';
import { LabelModel } from 'app/gamma/src/types/models';
import { LabelResponse } from 'app/gamma/src/types/responses';
import { createReducer } from '@trello/redux';
import { PERFORM_SEARCH_SUCCESS, PerformSearchSuccessAction } from './search';

// Reducer
export interface LabelState {
  [labelId: string]: LabelModel;
}

const initialState: LabelState = {};

export default createReducer(initialState, {
  [PERFORM_SEARCH_SUCCESS](state, { payload }: PerformSearchSuccessAction) {
    if (!payload.cards) {
      return state;
    }

    return payload.cards
      .reduce(
        (allLabels, card) => allLabels.concat(card.labels || []),
        [] as LabelResponse[],
      )
      .reduce((endState, label) => {
        if (!endState[label.id]) {
          endState[label.id] = normalizeLabel(label);
        }

        return endState;
      }, state);
  },
});
