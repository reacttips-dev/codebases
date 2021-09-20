import { SessionModel } from 'app/gamma/src/types/models';
import { SessionResponse } from 'app/gamma/src/types/responses';
import genericNormalizer, { normalizeDate } from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeSession = genericNormalizer<
  SessionResponse,
  SessionModel
>(({ from, has }) => ({
  dateLastUsed: has('dateLastUsed', normalizeDate),
  id: from('id'),
  ipAddress: from('ipAddress'),
  isCurrent: from('isCurrent'),
}));
