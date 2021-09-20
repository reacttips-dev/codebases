import { MemberMessagesDismissedModel } from 'app/gamma/src/types/models';

import { MemberMessagesDismissedResponse } from 'app/gamma/src/types/responses';

import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeMessagesDismissed = genericNormalizer<
  MemberMessagesDismissedResponse,
  MemberMessagesDismissedModel
>(({ from }) => ({
  _id: from('_id'),
  count: from('count'),
  lastDismissed: from('lastDismissed'),
  name: from('name'),
}));
