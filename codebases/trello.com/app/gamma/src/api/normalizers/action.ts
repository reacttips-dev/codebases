import { ActionDataModel, ActionModel } from 'app/gamma/src/types/models';
import {
  ActionDataResponse,
  ActionResponse,
} from 'app/gamma/src/types/responses';

import genericNormalizer, { normalizeDate } from './generic';

import { normalizeButlerRule } from './butler';
import { normalizeBoard } from './board';
import { normalizeCard } from './card';
import { normalizeTeam } from './team';
import { normalizeChecklist, normalizeChecklistItem } from './checklist';
import { normalizeList } from './list';
import { normalizeMember } from './member';

import { boardUrlFromShortLink } from 'app/gamma/src/util/url';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeActionData = genericNormalizer<
  ActionDataResponse,
  ActionDataModel
>(({ from, has }) => ({
  board: has('board', (board) =>
    normalizeBoard({
      ...board,
      url:
        board.shortLink && board.name
          ? boardUrlFromShortLink(board.shortLink, board.name)
          : undefined,
    }),
  ),
  card: has('card', normalizeCard),
  cardSource: from('cardSource'),
  checklistItem: has('checkItem', normalizeChecklistItem),
  checklist: has('checklist', normalizeChecklist),
  list: has('list', normalizeList),
  listAfter: has('listAfter', normalizeList),
  listBefore: has('listBefore', normalizeList),
  name: from('name'),
  plugin: from('plugin'),
  team: has('organization', normalizeTeam),
  text: from('text'),
  actionType: from('actionType'),
  rule: has('rule', normalizeButlerRule),
  idExport: from('idExport'),
}));

// eslint-disable-next-line @trello/no-module-logic
export const normalizeAction = genericNormalizer<ActionResponse, ActionModel>(
  ({ has, from }) => ({
    board: has('board', normalizeBoard),
    card: has('card', normalizeCard),
    data: has('data', normalizeActionData),
    date: has('date', normalizeDate),
    display: from('display'),
    id: from('id'),
    idBoard: has('data', ({ board }) => (board ? board.id : undefined)),
    idCard: has('data', ({ card }) => (card ? card.id : undefined)),
    idMemberCreator: from('idMemberCreator'),
    list: has('list', normalizeList),
    member: has('member', normalizeMember),
    memberCreator: has('memberCreator', normalizeMember),
    memberInviter: has('memberInviter', normalizeMember),
    type: from('type'),
  }),
);
