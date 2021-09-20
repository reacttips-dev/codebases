import { ActionHistory } from '@trello/action-history';
import {
  HistoryActionType,
  HistoryEntry,
} from '@trello/action-history/src/types';
import {
  Analytics,
  ActionType,
  Task,
  ActionSubjectType,
} from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { ModelCache } from 'app/scripts/db/model-cache';
import { Feature } from 'app/scripts/debug/constants';
import Alerts from 'app/scripts/views/lib/alerts';
import { ActionMap, doMap, undoMap, NoopError } from './action-map';
import { trackLastAction } from './track-last-action';
import {
  UserContext,
  isValidBoardContext,
  isValidCardContext,
  isValidActionTypeContext,
} from './validate-user-context';

// Exhaustive mapping from HistoryActionType to task fields for tracing.
// This includes action.types that may not currently be traced or repeatable.
const taskMap: {
  [type in HistoryActionType]: {
    taskName: Task;
    field: ActionSubjectType;
  };
} = {
  'add-checklist': {
    taskName: 'create-checklist',
    field: 'checklist',
  },
  'add-label': {
    taskName: 'edit-card/idLabels',
    field: 'idLabels',
  },
  'add-member': {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  archive: {
    taskName: 'edit-card/closed',
    field: 'closed',
  },
  delete: {
    taskName: 'delete-card',
    field: 'id',
  },
  join: {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  leave: {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  move: {
    taskName: 'edit-card/pos',
    field: 'position',
  },
  'remove-label': {
    taskName: 'edit-card/idLabels',
    field: 'idLabels',
  },
  'remove-member': {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  rename: {
    taskName: 'edit-card/name',
    field: 'name',
  },
  'set-due-date': {
    taskName: 'edit-card/due',
    field: 'due',
  },
  'update-description': {
    taskName: 'edit-card/desc',
    field: 'description',
  },
  unarchive: {
    taskName: 'edit-card/closed',
    field: 'closed',
  },
};

function handle({
  analyticsAction,
  entry: { action, context },
  userContext,
  map,
  callback,
}: {
  analyticsAction: ActionType;
  entry: HistoryEntry;
  userContext: UserContext;
  map: ActionMap;
  callback?: () => void;
}): void {
  const handler = map[action.type];
  if (!handler) {
    return;
  }
  let card;
  let message;

  const taskFields = taskMap[action.type];
  const { taskName, field } = taskFields;
  const task = {
    traceId:
      action.type !== 'move'
        ? Analytics.startTask({
            taskName,
            source: userContext.source,
          })
        : '',
    taskName,
    field,
    source: userContext.source,
  };

  try {
    // Use userContext for repeated actions to evaluate the card we're on now.
    card = ModelCache.get(
      'Card',
      analyticsAction === 'repeated' ? userContext.idCard : context.idCard,
    );
    if (!card) {
      return;
    }
    message = handler(card, action, task, context);
    callback?.();
  } catch (error) {
    if (error instanceof NoopError) {
      const { traceId, taskName, source } = task;
      if (traceId) {
        Analytics.taskAborted({ traceId, taskName, source });
      }
      return;
    }
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-workflowers',
        feature: Feature.UndoAction,
      },
      extraData: {
        analyticsAction,
        actionType: action.type,
        idCard: context.idCard,
        idBoard: context.idBoard,
        source: userContext.source,
        viewingCard: userContext.idCard ?? '',
        viewingBoard: userContext.idBoard ?? '',
      },
    });
    const { traceId, taskName, source } = task;
    if (traceId) {
      Analytics.taskFailed({ traceId, taskName, source, error });
    }
    return;
  }
  if (message) {
    Alerts.showLiteralText(message, 'subtle', 'lastAction', 2000);
  }
  trackLastAction({
    analyticsAction,
    actionType: action.type,
    card,
    source: userContext.source,
  });
}

export function undoAction(userContext: UserContext): void {
  const [entry] = ActionHistory.get();
  if (
    !entry ||
    Object.prototype.hasOwnProperty.call(entry, 'count') ||
    !isValidBoardContext(userContext, entry) ||
    !isValidCardContext(userContext, entry) ||
    !isValidActionTypeContext(userContext, entry)
  ) {
    return;
  }
  handle({
    analyticsAction: 'undone',
    entry,
    userContext,
    map: undoMap,
    callback: () => ActionHistory.undo(),
  });
}

export function redoAction(userContext: UserContext): void {
  const [entry] = ActionHistory.getUndoStack();
  if (
    !entry ||
    !isValidBoardContext(userContext, entry) ||
    !isValidCardContext(userContext, entry) ||
    !isValidActionTypeContext(userContext, entry)
  ) {
    return;
  }
  handle({
    analyticsAction: 'redone',
    entry,
    userContext,
    map: doMap,
    callback: () => ActionHistory.redo(),
  });
}

export function repeatAction(userContext: UserContext): void {
  const [entry] = ActionHistory.get();
  if (
    !entry ||
    Object.prototype.hasOwnProperty.call(entry, 'count') ||
    !isValidBoardContext(userContext, entry) ||
    // Exit early if we're on the same card; only repeat on different cards.
    isValidCardContext(userContext, entry) ||
    !isValidActionTypeContext(userContext, entry)
  ) {
    return;
  }
  handle({
    analyticsAction: 'repeated',
    entry,
    userContext,
    map: doMap,
  });
}
