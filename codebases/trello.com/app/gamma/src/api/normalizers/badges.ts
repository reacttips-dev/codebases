import { BadgeResponse } from 'app/gamma/src/types/responses';
import { BadgesModel } from 'app/gamma/src/types/models';
import genericNormalizer, { normalizeDate } from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeBadges = genericNormalizer<BadgeResponse, BadgesModel>(
  ({ from, has }) => ({
    attachments: from('attachments'),
    attachmentsByType: from('attachmentsByType'),
    checklistItems: from('checkItems'),
    checklistItemsChecked: from('checkItemsChecked'),
    comments: from('comments'),
    description: from('description'),
    due: has('due', normalizeDate),
    dueComplete: from('dueComplete'),
    start: has('start', normalizeDate),
    subscribed: from('subscribed'),
    viewingMemberVoted: from('viewingMemberVoted'),
    votes: from('votes'),
    checkItemsEarliestDue: has('checkItemsEarliestDue', normalizeDate),
  }),
);
