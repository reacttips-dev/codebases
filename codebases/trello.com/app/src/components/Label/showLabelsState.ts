import { PersistentSharedState } from '@trello/shared-state';

export interface ShowLabelsState {
  showText: boolean;
}

// eslint-disable-next-line @trello/no-module-logic
export const showLabelsState = new PersistentSharedState<ShowLabelsState>(
  { showText: false },
  { storageKey: 'labelState' },
);
