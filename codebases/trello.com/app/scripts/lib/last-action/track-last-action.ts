import { HistoryActionType } from '@trello/action-history/src/types';
import {
  Analytics,
  ActionSubjectIdType,
  ActionType,
  SourceType,
} from '@trello/atlassian-analytics';

const actionTypeToActionSubjectId: {
  [type in HistoryActionType]?: ActionSubjectIdType;
} = {
  join: 'joinCardAction',
  leave: 'leaveCardAction',
  'add-member': 'addMemberToCardAction',
  'remove-member': 'removeMemberFromCardAction',
  move: 'moveCardAction',
  'add-label': 'addLabelToCardAction',
  'remove-label': 'removeLabelFromCardAction',
  archive: 'archiveCardAction',
  unarchive: 'unarchiveCardAction',
  'set-due-date': 'setCardDueDateAction',
  rename: 'renameCardAction',
  'update-description': 'updateCardDescriptionAction',
};

interface Props {
  analyticsAction: ActionType;
  actionType: HistoryActionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card: any;
  source: SourceType;
}

export function trackLastAction({
  analyticsAction,
  actionType,
  card,
  source,
}: Props): void {
  Analytics.sendTrackEvent({
    action: analyticsAction,
    actionSubject: 'action',
    actionSubjectId: actionTypeToActionSubjectId[actionType],
    source,
    containers: {
      board: { id: card.get('idBoard') },
      card: { id: card.id },
    },
  });
}
