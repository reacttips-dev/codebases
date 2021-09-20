import { memberId } from '@trello/session-cookie';
import { TrelloStorage } from '@trello/storage';
import { ActionStorage } from './action-history';
import { HistoryEntry } from './types';
import { cleanHistory } from './clean-history';

const STORAGE_KEY = memberId ? `action_history_${memberId}` : undefined;

export const localActionStorage: ActionStorage = {
  read() {
    return STORAGE_KEY ? cleanHistory(TrelloStorage.get(STORAGE_KEY)) : [];
  },

  write(history: HistoryEntry[]) {
    if (STORAGE_KEY) {
      TrelloStorage.set(STORAGE_KEY, history);
    }
  },
};

const UNDO_STORAGE_KEY = memberId
  ? `action_history_undo_stack_${memberId}`
  : undefined;

export const localUndoStackStorage: ActionStorage = {
  read() {
    return UNDO_STORAGE_KEY ? TrelloStorage.get(UNDO_STORAGE_KEY) || [] : [];
  },

  write(history: HistoryEntry[]) {
    if (UNDO_STORAGE_KEY) {
      TrelloStorage.set(UNDO_STORAGE_KEY, history);
    }
  },
};
