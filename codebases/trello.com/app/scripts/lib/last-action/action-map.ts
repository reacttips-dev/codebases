import {
  HistoryAction,
  HistoryActionType,
  HistoryContext,
  Join,
  Leave,
  AddMember,
  RemoveMember,
  Move,
  AddLabel,
  RemoveLabel,
  Rename,
  UpdateDescription,
  SetDueDate,
} from '@trello/action-history/src/types';
import {
  ActionSubjectType,
  Analytics,
  Task,
  SourceType,
  tracingCallback,
} from '@trello/atlassian-analytics';
import { formatHumanDate } from '@trello/dates';
import { forNamespace } from '@trello/i18n';
import { ModelCache } from 'app/scripts/db/model-cache';
import type { Member } from 'app/scripts/models/member';
import type { List } from 'app/scripts/models/list';
import type { Board } from 'app/scripts/models/board';
import type { Label } from 'app/scripts/models/label';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

function onTracedCardUpdate({
  card,
  traceId,
  taskName,
  source,
  field,
}: {
  card: { id: string; get: (_: string) => string };
  traceId: string;
  taskName: Task;
  source: SourceType;
  field: ActionSubjectType;
}) {
  return tracingCallback(
    {
      taskName,
      traceId,
      source,
    },
    () => {
      Analytics.sendUpdatedCardFieldEvent({
        field,
        source,
        containers: {
          card: { id: card.id },
          board: { id: card.get('idBoard') },
          list: { id: card.get('idList') },
        },
        attributes: {
          taskId: traceId,
        },
      });
    },
  );
}

export class NoopError extends Error {
  constructor() {
    super('noop');
    this.name = 'NoopError';
  }
}

const getCached = (type: string, id: string) => {
  // @ts-expect-error
  const cached = ModelCache.get(type, id);
  if (!cached) {
    // If model is not in cache, that's fine; a user could be trying to undo or
    // redo an action from long ago that is no longer referenceable in cache.
    throw new NoopError();
  }
  return cached;
};

export type ActionMap = {
  [type in HistoryActionType]?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    card: any,
    action: HistoryAction,
    trace: {
      traceId: string;
      taskName: Task;
      field: ActionSubjectType;
      source: SourceType;
    },
    context: HistoryContext,
  ) => string | undefined;
};

export const doMap: ActionMap = {
  join: (card, action: Join, trace) => {
    if (card.hasMember(action.idMember)) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.addMemberWithTracing(
      action.idMember,
      traceId,
      onTracedCardUpdate({ card, ...trace }),
    );
    return format('notification_joined_card');
  },
  leave: (card, action: Leave, trace) => {
    if (!card.hasMember(action.idMember)) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.removeMemberWithTracing(
      action.idMember,
      traceId,
      onTracedCardUpdate({ card, ...trace }),
    );
    return format('notification_left_card');
  },
  'add-member': (card, action: AddMember, trace) => {
    if (card.hasMember(action.idMember)) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.addMemberWithTracing(
      action.idMember,
      traceId,
      onTracedCardUpdate({ card, ...trace }),
    );
    const member = getCached('Member', action.idMember) as Member;
    return format('notification_added_member_to_card', {
      member: member.get('fullName'),
    });
  },
  'remove-member': (card, action: RemoveMember, trace) => {
    if (!card.hasMember(action.idMember)) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.removeMemberWithTracing(
      action.idMember,
      traceId,
      onTracedCardUpdate({ card, ...trace }),
    );
    const member = getCached('Member', action.idMember) as Member;
    return format('notification_removed_member_from_card', {
      member: member.get('fullName'),
    });
  },
  move: (card, action: Move) => {
    // In the case of repeatAction, `context` won't match the given card,
    // so check the card's original location rather than using `context`.
    const prevIdBoard = card.get('idBoard');
    const prevIdList = card.get('idList');
    const list = getCached('List', action.idList) as List;
    let index;
    if (action.position === 'top') {
      index = 0;
    } else if (action.position === 'bottom') {
      index = list.openCards().length;
    } else {
      // If the position is arbitrary, it probably doesn't matter too much, but
      // drop it underneath the last card just in case.
      index = action.position + 1;
    }
    card.moveToList(list, index);
    if (prevIdBoard !== action.idBoard) {
      return format('notification_moved_card_to_board', {
        list: list.get('name'),
        board: (getCached('Board', action.idBoard) as Board)?.get('name'),
      });
    }
    if (prevIdList === action.idList) {
      return format('notification_moved_card_within_list', {
        list: list.get('name'),
      });
    }
    return format('notification_moved_card', { list: list.get('name') });
  },
  'add-label': (card, action: AddLabel) => {
    const label = getCached('Label', action.idLabel) as Label;
    if (card.hasLabel(label)) {
      throw new NoopError();
    }
    card.toggleLabel(label, true);
    return format('notification_added_label_to_card', {
      label: label.get('name'),
    });
  },
  'remove-label': (card, action: RemoveLabel) => {
    const label = getCached('Label', action.idLabel) as Label;
    if (!card.hasLabel(label)) {
      throw new NoopError();
    }
    card.toggleLabel(label, false);
    return format('notification_removed_label_from_card', {
      label: label.get('name'),
    });
  },
  archive: (card, _, trace) => {
    if (card.get('closed')) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.close(traceId, onTracedCardUpdate({ card, ...trace }));
    return format('notification_archived_card');
  },
  unarchive: (card, _, trace) => {
    if (!card.get('closed')) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.reopen(traceId, onTracedCardUpdate({ card, ...trace }));
    return format('notification_unarchived_card');
  },
  'set-due-date': (card, { dueDate }: SetDueDate, trace) => {
    // Get field from card rather than `action.previousDueDate` for repeat.
    const previousDueDate = {
      due: card.getDueDate()?.getTime() || null,
      dueReminder: card.get('dueReminder') || -1,
    };
    if (
      previousDueDate.due === dueDate.due &&
      previousDueDate.dueReminder === dueDate.dueReminder
    ) {
      throw new NoopError();
    }
    const { traceId } = trace;
    card.setDueDate(
      { ...dueDate, traceId },
      onTracedCardUpdate({ card, ...trace }),
    );
    if (!dueDate.due) {
      return format('notification_removed_due_date');
    }
    const humanDate = formatHumanDate(new Date(dueDate.due));
    if (!previousDueDate.due) {
      return format('notification_added_a_due_date', { date: humanDate });
    }
    if (dueDate.due === previousDueDate.due) {
      return format('notification_changed_due_date_reminder');
    }
    return format('notification_changed_due_date', { date: humanDate });
  },
  rename: (card, action: Rename, trace) => {
    card.recordAction({
      ...action,
      previousName: card.get('name'),
    });
    const { traceId } = trace;
    card.update(
      { name: action.name, traceId },
      onTracedCardUpdate({ card, ...trace }),
    );
    return format('notification_renamed_card');
  },
  'update-description': (card, action: UpdateDescription, trace) => {
    card.recordAction({
      ...action,
      previousDescription: card.get('desc'),
    });
    const { traceId } = trace;
    card.update(
      { desc: action.description, traceId },
      onTracedCardUpdate({ card, ...trace }),
    );
    return format('notification_updated_description_of_card');
  },
};

export const undoMap: ActionMap = {
  join: doMap.leave,
  leave: doMap.join,
  'add-member': doMap['remove-member'],
  'remove-member': doMap['add-member'],
  move: (card, action: Move, _, context) => {
    const list = getCached('List', context.idList) as List;
    card.moveToList(list, action.fromPosition);
    if (action.idBoard !== context.idBoard) {
      return format('notification_moved_card_to_board', {
        list: list.get('name'),
        board: (getCached('Board', context.idBoard) as Board).get('name'),
      });
    }
    if (action.idList === context.idList) {
      return format('notification_moved_card_within_list', {
        list: list.get('name'),
      });
    }
    return format('notification_moved_card', { list: list.get('name') });
  },
  'add-label': doMap['remove-label'],
  'remove-label': doMap['add-label'],
  archive: doMap.unarchive,
  unarchive: doMap.archive,
  'set-due-date': (card, action: SetDueDate, trace, context) => {
    const invertedAction = {
      ...action,
      dueDate: action.previousDueDate,
      previousDueDate: action.dueDate,
    };
    return doMap['set-due-date']?.(card, invertedAction, trace, context);
  },
  rename: (card, action: Rename, trace, context) => {
    const invertedAction = {
      ...action,
      name: action.previousName,
      previousName: action.name,
    };
    return doMap.rename?.(card, invertedAction, trace, context);
  },
  'update-description': (card, action: UpdateDescription, trace, context) => {
    const invertedAction = {
      ...action,
      description: action.previousDescription,
      previousDescription: action.description,
    };
    return doMap['update-description']?.(card, invertedAction, trace, context);
  },
};
