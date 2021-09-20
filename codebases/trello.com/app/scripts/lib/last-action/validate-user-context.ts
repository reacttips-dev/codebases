import {
  HistoryAction,
  HistoryEntry,
  Move,
  HistoryActionType,
} from '@trello/action-history/src/types';
import { SourceType } from '@trello/atlassian-analytics';

export interface UserContext {
  source: SourceType;
  idBoard?: string;
  idCard?: string;
}

const isMoveAction = (action: HistoryAction): action is Move =>
  action.type === 'move';

export const isValidBoardContext = (
  { idBoard }: UserContext,
  { action, context }: HistoryEntry,
): boolean =>
  !idBoard ||
  idBoard === context.idBoard ||
  // If the action involves another board, the destination board is valid too.
  (isMoveAction(action) && action.idBoard === idBoard);

export const isValidCardContext = (
  { idCard }: UserContext,
  { context }: HistoryEntry,
): boolean => !idCard || idCard === context.idCard;

const validActionsFromBoardViewContext: HistoryActionType[] = [
  'join',
  'leave',
  'add-member',
  'remove-member',
  'move',
  'add-label',
  'remove-label',
  'archive',
  'unarchive',
  'set-due-date',
  'rename',
];

/**
 * Whitelist actions that are specifically visible from the board view.
 * Currently supported sources are boardScreen, cardDetailScreen, cardView;
 * all actions are supported from cardDetailScreen today.
 */
export const isValidActionTypeContext = (
  { source }: UserContext,
  { action }: HistoryEntry,
): boolean =>
  source === 'cardDetailScreen' ||
  validActionsFromBoardViewContext.includes(action.type);
